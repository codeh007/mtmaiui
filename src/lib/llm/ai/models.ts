import { createOpenAI } from "@ai-sdk/openai";
// Define your models here.
import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

// 新增 ====================================================================
export const registry = createProviderRegistry({
  // register provider with prefix and default setup:
  // anthropic,

  // register provider with prefix and custom setup:
  openai: createOpenAI({
    apiKey: "myfakeopenaikey123123",
    baseURL: "https://api.test-model1.com",
  }),
  testmodel1: createOpenAI({
    apiKey: "myfakeopenaikey123123",
    baseURL: "https://api.test-model1.com",
  }),
  mtm: createOpenAI({
    apiKey: "myfakeopenaikey123123",
    baseURL: "https://api.test-model1.com",
  }),
});
// 新增 结束 ---------------------------------------------------------------

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "gpt-4o",
    description: "For complex, multi-step tasks",
  },
  {
    id: "testmodel1",
    label: "Test Model 1",
    apiIdentifier: "testmodel1",
    description: "For complex, multi-step tasks",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "testmodel1";
