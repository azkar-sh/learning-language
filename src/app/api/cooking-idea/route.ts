/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
    notes?: string;
  }[];
  instructions: string[];
  nutritionFacts: { [key: string]: string };
  notes?: string;
  language: string; // Properti language ditambahkan
}

const recipeSchema = {
  type: "object",
  properties: {
    recipeName: { type: "string" },
    description: { type: "string" },
    prepTime: { type: "string" },
    cookTime: { type: "string" },
    servings: { type: "string" },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          quantity: { type: "string" },
          unit: { type: "string" },
          notes: { type: "string" },
        },
        required: ["name", "quantity", "unit"],
      },
    },
    instructions: { type: "array", items: { type: "string" } },
    nutritionFacts: {
      type: "object",
      additionalProperties: { type: "string" },
    },
    notes: { type: "string" },
    language: { type: "string" },
  },
  required: [
    "recipeName",
    "description",
    "prepTime",
    "cookTime",
    "servings",
    "ingredients",
    "instructions",
    "nutritionFacts",
    "language",
  ],
};

const validateRecipe = ajv.compile<Recipe>(recipeSchema);

async function generateRecipe(
  requestBody: Partial<Recipe>
): Promise<Recipe | { error: string; code?: number }> {
  const jsonSchema = JSON.stringify(recipeSchema, null, 4);

  let prompt = `You are a chef that can give me a proper recipe, with precise amounts in ml, gram, or spoon, making time estimates, and nutrition facts. Return it as JSON.\nThe JSON object must follow this schema: ${jsonSchema}\n\nGenerate a recipe in ${requestBody.language} based on the following criteria:\n`;

  // Format ingredients array correctly
  if (requestBody.ingredients && Array.isArray(requestBody.ingredients)) {
    prompt += "ingredients:\n";
    requestBody.ingredients.forEach((ingredient) => {
      prompt += `- ${ingredient.quantity} ${ingredient.unit} ${
        ingredient.name
      } ${ingredient.notes ? `(${ingredient.notes})` : ""}\n`;
    });
  }

  // Add other criteria to the prompt
  for (const key in requestBody) {
    if (key !== "ingredients") {
      // Skip ingredients as it's already formatted
      prompt += `${key}: ${requestBody[key as keyof typeof requestBody]}\n`;
    }
  }

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert chef knowledgeable in various cuisines and dietary restrictions. You generate recipes based on user requests, including translating all textual content (recipe name, description, ingredients, instructions, nutrition facts, notes) to the specified language. You may add other ingredients if needed. Always return valid JSON.`,
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      stream: false,
      response_format: { type: "json_object" },
    });

    if (
      !chat_completion.choices ||
      !chat_completion.choices[0]?.message?.content
    ) {
      return { error: "Unexpected response from Groq API", code: 502 };
    }

    const generatedRecipe = JSON.parse(
      chat_completion.choices[0].message.content as string
    ) as Recipe;

    const isValid = validateRecipe(generatedRecipe);
    if (!isValid) {
      return {
        error:
          "Invalid generated recipe: " + ajv.errorsText(validateRecipe.errors),
        code: 400,
      };
    }

    return generatedRecipe;
  } catch (error: any) {
    return {
      error: "Failed to generate a recipe. Error: " + error.message,
      code: 500,
    };
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const recipe = await generateRecipe(requestBody);

    if ("error" in recipe) {
      return NextResponse.json(recipe, { status: recipe.code || 500 });
    }

    return NextResponse.json(recipe, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid request", code: 400 },
      { status: 400 }
    );
  }
}
