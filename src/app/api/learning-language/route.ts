/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

interface Question {
  question_type: "multiple_choice" | "true_false";
  level: "beginner" | "intermediate" | "advanced" | "expert" | "master";
  language: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
}

const schema = {
  type: "object",
  properties: {
    question_type: { type: "string", enum: ["multiple_choice", "true_false"] },
    level: {
      type: "string",
      enum: ["beginner", "intermediate", "advanced", "expert", "master"],
    },
    language: { type: "string" },
    topic: { type: "string" },
    question: { type: "string" },
    options: { type: "array", items: { type: "string" } },
    correct_answer: { type: "string" },
  },
  required: [
    "question_type",
    "level",
    "language",
    "topic",
    "question",
    "options",
    "correct_answer",
  ],
};

const validate = ajv.compile<Question>(schema);

async function generateQuestion(
  requestBody: Omit<Question, "question">
): Promise<Question | { error: string; code?: number }> {
  const jsonSchema = JSON.stringify(schema, null, 4);

  let prompt = `You are a question generator that outputs questions in JSON.\nThe JSON object must use the schema: ${jsonSchema}\n\nGenerate a question based on the following criteria:\n`;

  for (const key in requestBody) {
    prompt += `${key}: ${requestBody[key as keyof typeof requestBody]}\n`;
  }

  if (requestBody.question_type === "true_false") {
    prompt +=
      "\nSince the question type is 'true_false', the 'options' field must contain only 'True' and 'False' (case-insensitive). Ensure one of these is the 'correct_answer'.";
  }

  if (requestBody.level) {
    switch (requestBody.level) {
      case "beginner":
        prompt +=
          "\nThe question should be simple and straightforward, suitable for someone with basic knowledge of the topic.";
        break;
      case "intermediate":
        prompt +=
          "\nThe question should be moderately challenging, requiring some understanding of the topic beyond the basics.";
        break;
      case "advanced":
        prompt +=
          "\nThe question should be complex and require a deep understanding of the topic, potentially involving multiple concepts or nuanced situations.";
        break;
      case "expert":
        prompt +=
          "\nThe question should be very challenging, requiring extensive knowledge and the ability to apply it creatively or critically.  It may involve complex problem-solving or analysis.";
        break;
      case "master":
        prompt +=
          "\nThe question should be extremely difficult, pushing the boundaries of knowledge in the topic. It may require original thought, synthesis of multiple disciplines, or dealing with ambiguity and incomplete information.";
        break;
      default:
        prompt +=
          "\nThe question should be appropriate for the specified level.";
        break;
    }
  }

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a educator that has perfect knowledge to generate questions for ${requestBody.language} based on ${requestBody.topic} and ${requestBody.level} level.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-specdec",
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

    const generatedQuestion = JSON.parse(
      chat_completion.choices[0].message.content as string
    ) as Question;

    if (requestBody.question_type === "true_false") {
      if (
        !generatedQuestion.options ||
        generatedQuestion.options.length !== 2 ||
        !generatedQuestion.options.every(
          (option) =>
            option.toLowerCase() === "true" || option.toLowerCase() === "false"
        )
      ) {
        return {
          error:
            "For true_false questions, options must be 'True' and 'False'.",
          code: 409,
        };
      }
    }

    const isValid = validate(generatedQuestion);
    if (!isValid) {
      console.error("Generated question is invalid:", validate.errors);
      return {
        error: "Invalid generated question: " + ajv.errorsText(validate.errors),
        code: 400,
      };
    }

    return generatedQuestion;
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
    const question = await generateQuestion(requestBody);

    if ("error" in question) {
      return NextResponse.json(question, { status: question.code || 500 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
