/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

interface Story {
  title: string;
  genre: string;
  text_story: string;
  setting: string;
  language: string;
  short_idea: string;
}

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    genre: { type: "string" },
    text_story: { type: "string" },
    setting: { type: "string" },
    language: { type: "string" },
    short_idea: { type: "string" },
  },
  required: [
    "title",
    "genre",
    "text_story",
    "setting",
    "language",
    "short_idea",
  ],
};

const validate = ajv.compile<Story>(schema);

async function generateStory(
  requestBody: Omit<Story, "question">
): Promise<Story | { error: string; code?: number }> {
  const jsonSchema = JSON.stringify(schema, null, 4);

  let prompt = `You are a storyteller that outputs stories in JSON.\nThe JSON object must use the schema: ${jsonSchema}\n\nGenerate a story based on the following criteria:\n`;

  prompt +=
    "The story contain minimum 800 words and maximum 1000 words (exclude HTML tags).\n Don't add the prolog or epilogue, just focus on the story content.\n Format the story using HTML tags for styling and structure to enhance readability.\n";

  for (const key in requestBody) {
    prompt += `${key}: ${requestBody[key as keyof typeof requestBody]}\n`;
  }

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a storyteller capable of crafting stories that captivate readers through compelling narration, dynamic character interactions, and vivid scenery that immerses readers in a world of imagination.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      stream: false,
      response_format: { type: "json_object" },
    });

    const generatedStory = JSON.parse(
      chat_completion.choices[0].message.content as string
    ) as Story;

    if (!validate(generatedStory)) {
      return { error: "Invalid story generated", code: 400 };
    }

    return generatedStory;
  } catch (error: any) {
    console.error("Error generating question:", error);
    return {
      error: "Failed to generate a question. Error: " + error.message,
      code: 500,
    };
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const story = await generateStory(requestBody);

    if ("error" in story) {
      return NextResponse.json(story, { status: story.code || 500 });
    }

    return NextResponse.json(story, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
