import { createOpenAI } from "@ai-sdk/openai";

export function getAisdkOpenai() {
  // return createOpenAI({
  //   baseURL: "https://colab-8055.yuepa8.com/",
  //   apiKey: "sk-feihuo321",
  // });

  return createOpenAI({
    baseURL: "https://free.v36.cm/v1",
    apiKey: "sk-1e6OMWlFcNh1kJIGF9B673A2110a437e865e429301294b30",
  });
}

export function getAisdkModel(model: string) {
  const _model = "gpt-4o-mini";
  return getAisdkOpenai()(_model);
}
