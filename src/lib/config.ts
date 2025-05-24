export const mtmaiAppInitState = {
  default_open_ai_key: "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",
  default_open_base_url: "https://integrate.api.nvidia.com/v1",
  default_open_model: "nvidia/llama-3.3-nemotron-super-49b-v1",

  // apiEndpoint: "https://mtmag.yuepa8.com",
};

export const getAppConfig = () => {
  return {
    ...mtmaiAppInitState,
    mtmServerUrl:
      // process.env?.MTM_SERVER_URL ||
      // `https://${process.env?.VERCEL_URL}` ||
      // "http://localhost:8383",
      "https://www.yuepa8.com",
  };
};
