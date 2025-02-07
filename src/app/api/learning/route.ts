/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

interface Question {
  question_type: "multiple_choice" | "true_false" | "random";
  level:
    | "beginner"
    | "intermediate"
    | "advanced"
    | "expert"
    | "master"
    | "random";
  language: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
}

const schema = {
  type: "object",
  properties: {
    question_type: {
      type: "string",
      enum: ["multiple_choice", "true_false", "random"],
    },
    level: {
      type: "string",
      enum: [
        "beginner",
        "intermediate",
        "advanced",
        "expert",
        "master",
        "random",
      ],
    },
    language: { type: "string" },
    topic: { type: "string" },
    question: { type: "string" },
    options: { type: "array", items: { type: "string" } },
    correct_answer: { type: "string" },
    correct_answer_reason: { type: "string" },
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

const topics: { [key: string]: string[] } = {
  Grammar: [
    "Syntax",
    "Tenses",
    "Punctuation",
    "Verbs",
    "Nouns",
    "Adjectives",
    "Prepositions",
    "Pronouns",
    "Conjunctions",
    "Articles",
  ],
  Math: [
    "Algebra",
    "Geometry",
    "Calculus",
    "Trigonometry",
    "Fractions",
    "Equations",
    "Probability",
    "Statistics",
    "Graphs",
    "Functions",
  ],
  History: [
    "Civilization",
    "Revolution",
    "Dynasty",
    "Empire",
    "Warfare",
    "Colonization",
    "Renaissance",
    "Independence",
    "Monarchy",
    "Constitution",
  ],
};

const usedTopics: { [key: string]: string[] } = {};

function getUniqueTopic(subject: string) {
  if (!topics[subject]) return "No topics available";

  if (!usedTopics[subject]) usedTopics[subject] = [];
  const availableTopics = topics[subject].filter(
    (t) => !usedTopics[subject].includes(t)
  );

  if (availableTopics.length === 0) {
    usedTopics[subject] = []; // Reset if all topics are used
  }

  const newTopic =
    availableTopics[Math.floor(Math.random() * availableTopics.length)];
  usedTopics[subject].push(newTopic);
  return newTopic;
}

async function generateQuestion(
  requestBody: Omit<Question, "question">
): Promise<Question | { error: string; code?: number }> {
  const jsonSchema = JSON.stringify(schema, null, 4);

  let prompt = `You are a question generator that outputs questions in JSON format.\nThe JSON object must follow this schema: ${jsonSchema}\n\nGenerate a question based on the following criteria:\n`;

  for (const key in requestBody) {
    prompt += `${key}: ${requestBody[key as keyof typeof requestBody]}\n`;
  }

  const selectedTopic = getUniqueTopic(requestBody.topic);
  if (requestBody.topic) {
    prompt += `\nUse the specific concept from this topic: ${selectedTopic}`;
  }

  if (requestBody.question_type === "random") {
    const questionTypes = ["multiple choice", "true false"];
    const randomType =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];

    prompt += `\nGenerate a ${randomType} question. `;

    if (randomType === "multiple choice") {
      prompt +=
        "Provide four options in the following format: [option1, option2, option3, option4].";
    } else if (randomType === "true false") {
      prompt +=
        "Provide two options in the following format: [option1, option2]. The answer should be either 'True' or 'False'.";
    }
  }

  if (requestBody.level === "random") {
    const levels = ["beginner", "intermediate", "advanced", "expert", "master"];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    prompt += `\nGenerate a question at ${randomLevel} level.`;
  }

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an educator with perfect knowledge to generate ${requestBody.language} questions on ${requestBody.topic} at ${requestBody.level} level.`,
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

    const generatedQuestion = JSON.parse(
      chat_completion.choices[0].message.content as string
    ) as Question;
    const isValid = validate(generatedQuestion);
    if (!isValid) {
      return {
        error: "Invalid generated question: " + ajv.errorsText(validate.errors),
        code: 400,
      };
    }

    return generatedQuestion;
  } catch (error: any) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid request", code: 400 },
      { status: 400 }
    );
  }
}
