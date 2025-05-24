import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit/beta";
import { defineCodeFormat } from "./code-format.js";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: gemini20Flash.withConfig({ version: "gemini-2.5-pro-exp-03-25" }),
});

defineCodeFormat(ai);

export { z } from "genkit/beta";
