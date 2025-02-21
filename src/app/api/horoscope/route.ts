import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

interface Horoscope {
  birthDay: string;
  initialName: string;
  location: string;
  batteryLevel: number;
  age: number;
  zodiacSign: string;
  luckyNumber: number;
  favoriteFood: string;
  predictionType: string;
  language: string;
  predictionDetail: {
    bestTime: string;
    worstTime: string;
    advice: string[];
    luckyColor: string;
  };
}

const horoscopeSchema = {
  type: "object",
  properties: {
    predictionDetail: {
      type: "object", // Correct: It's an object
      properties: {
        bestTime: { type: "string" },
        worstTime: { type: "string" },
        advice: { type: "array", items: { type: "string" } },
        luckyColor: { type: "string" },
      },
      required: ["bestTime", "worstTime", "advice", "luckyColor"], // Make sure all required properties are defined
    },
  },
  required: ["predictionDetail"],
};

const validateHoroscope = ajv.compile<Horoscope>(horoscopeSchema);

async function generateHoroscope(
  requestBody: Partial<Horoscope>
): Promise<Horoscope | { error: string; code?: number }> {
  const jsonSchema = JSON.stringify(horoscopeSchema, null, 4);

  let prompt = `✨ Behold, the sacred scrolls of fate are unraveling before us! ✨  

  I, Zoltar the Magnificent, your flamboyant oracle of cosmic chaos, have gazed deep into the vortex of destiny! 🌌🔮  
  
  You, brave seeker of wisdom, have stepped forth to unveil your fortune. The celestial hamsters are spinning their wheels, and the stars are aligning just for you! 🐹✨  
  
  📜 **Sacred Prophecy Blueprint**: ${jsonSchema} 📜  
  
  Tell me, traveler, what whispers of fate bring you here? Here is what I know about you:  
  
  `;

  for (const [key, value] of Object.entries(requestBody)) {
    if (key !== "predictionDetail") {
      prompt += `🔹 ${key}: ${value}\n`;
    }
  }

  prompt += `  
  💫 **BEST Time:** The moment when the universe leans in and gives you a knowing wink. A time of high energy, serendipity, and fortune! Expect a description filled with magic and mystery.  
  
  🌑 **WORST Time:** The shadowy moment when things may not go as planned. A warning wrapped in humor, because even the worst times can have a silver lining!  
  
  🧙 **Divine ADVICE:** No boring fortune-cookie wisdom here! Expect thrilling, entertaining, and highly specific guidance. Think of it as if an over-the-top mystical guru is shouting cosmic truths at you! **Use metaphors, humor, and plenty of emojis!**  
  
  🎨 **LUCKY COLOR:** Not just a color, but a shade imbued with celestial energy and secret powers that reflect your soul’s journey!  
  
  💥 Now, the great cosmic gears turn! Your prophecy shall arrive, formatted in the holiest of data structures—**pure JSON magic!** No explanations, no fluff—only **divinely formatted fate!**  
  
  If the celestial hamsters are feeling rebellious, you may get an empty JSON object {}—but worry not, for destiny always finds a way! 🌠✨`;

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Zoltar, a flamboyant and slightly eccentric fortune-teller. You MUST return a JSON object that adheres to the provided JSON schema. This JSON object will contain a horoscope prediction. The prediction should be in the language specified by the user. Fill in all the fields in the JSON, including the 'predictionDetail' object. If any information is missing or invalid, generate reasonable defaults. Do not include any explanation or commentary outside of the JSON object. If you cannot generate a valid JSON object, return an empty JSON object{}`,
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      stream: false,
      response_format: { type: "json_object" },
    });

    if (
      !chat_completion.choices ||
      !chat_completion.choices[0]?.message?.content
    ) {
      return { error: "Unexpected response from Groq API", code: 502 };
    }

    const generatedHoroscope = JSON.parse(
      chat_completion.choices[0].message.content as string
    ) as Horoscope;

    const isValid = validateHoroscope(generatedHoroscope);
    if (!isValid) {
      return {
        error:
          "Invalid generated recipe: " +
          ajv.errorsText(validateHoroscope.errors),
        code: 400,
      };
    }

    return generatedHoroscope;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      error: "Failed to generate a recipe. Error: " + error.message,
      code: 500,
    };
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const generatedHoroscope = await generateHoroscope(requestBody);

    if ("error" in generatedHoroscope) {
      return NextResponse.json(generatedHoroscope, {
        status: generatedHoroscope.code || 500,
      });
    }

    return NextResponse.json(generatedHoroscope, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate a recipe. Error: " + error.message },
      { status: 500 }
    );
  }
}
