import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from "ai";
// import { xai } from '@ai-sdk/xai';

const googleModelClient = createGoogleGenerativeAI({
  // apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
const geminiModel = googleModelClient("gemini-2.0-flash-exp", {});

export const myProvider = customProvider({
  languageModels: {
    // 'chat-model': xai('grok-2-vision-1212'),
    "chat-model": geminiModel,
    "chat-model-reasoning": wrapLanguageModel({
      model: geminiModel,
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": geminiModel,
    "artifact-model": geminiModel,
  },
  imageModels: {
    // 'small-model': xai.image('grok-2-image'),
    // 'small-model': geminiModel,
  },
});
