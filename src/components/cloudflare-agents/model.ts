// export const model = openai("gpt-4o");
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider";
// import { openai } from "@ai-sdk/openai";
// import { createWorkersAI } from "workers-ai-provider";

export const getDefaultModel = (env: Env) => {
  // const aa= createWorkersAI("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});
  // const modelClient = createWorkersAI({ binding: env.AI });
  // const model = modelClient("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});
  console.log(`getDefaultModel ${env.GOOGLE_GENERATIVE_AI_API_KEY}`);
  const googleModelClient = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const model = googleModelClient("gemini-2.0-flash-exp", {});

  return model;
};

const ollamaApiUrl = "http://localhost:11434/api";

export const getOllamaModel = (env: Env) => {
  const ollama = createOllama({
    baseURL: ollamaApiUrl,
  });
  const model = ollama("phi3");

  // const model = ollama.embedding('nomic-embed-text');
  return model;
};
