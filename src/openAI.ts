import OpenAI from "openai";
import {
  OPENAI_API_KEY,
  OPENAI_FREQUENCY_PENALTY,
  OPENAI_MAX_TOKENS,
  OPENAI_MODEL,
  OPENAI_PRESENCE_PENALTY,
  OPENAI_SYSTEM_PROMPT,
  OPENAI_TEMPERATURE,
  OPENAI_TOP_P,
  PROMPT_IMAGE,
} from "./constants";
import { formatHTML } from "./utils";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export type MakePlanRequest = {
  name: string;
  gender: string;
  height: string;
  weight: string;
  target: string;
  duration: string;
  numberDaysWorkingOutPerWeek: number;
  foodAllergies: string;
};

export async function makePlan(request: MakePlanRequest) {
  const prompt = formatHTML(OPENAI_SYSTEM_PROMPT, request);

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL.GPT_3_5_TURBO,
    temperature: OPENAI_TEMPERATURE,
    max_tokens: OPENAI_MAX_TOKENS,
    top_p: OPENAI_TOP_P,
    frequency_penalty: OPENAI_FREQUENCY_PENALTY,
    presence_penalty: OPENAI_PRESENCE_PENALTY,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content as string;
}

export async function calculateImage(url: string) {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL.GPT_4O,
    temperature: OPENAI_TEMPERATURE,
    max_tokens: OPENAI_MAX_TOKENS,
    top_p: OPENAI_TOP_P,
    frequency_penalty: OPENAI_FREQUENCY_PENALTY,
    presence_penalty: OPENAI_PRESENCE_PENALTY,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: PROMPT_IMAGE,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${url}`,
              detail: "high",
            },
          },
        ],
      },
    ],
  });

  return completion.choices[0].message.content;
}
