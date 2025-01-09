import { createOpenAI } from "@ai-sdk/openai";
// see https://docs.anthropic.com/en/docs/about-claude/models
export const MAX_TOKENS = 8192;

// limits the number of model responses that can be returned in a single request
export const MAX_RESPONSE_SEGMENTS = 2;


export const llm_configs = {
  llms: [
    {
      id: "chat",
      name: "chat",
      provider: "together_ai",
      base_url: "https://api.together.xyz/v1",
      api_key:  "29cead0a87a33dff3d5f5d377adb962fcf5d0661770d3994fc6d0e95c70c5139",
      is_tool_use: true,
      model: "together_ai/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      llm_type: "llama3.1",
      // # base_url: "http://localhost:3400/api/llm_proxy"
      // # base_url: "https://3400-niutrans-classicalmoder-9fbkp8wozlh.ws-us116.gitpod.io/api/llm_proxy"
    }
  ]
}


// const apiKey =
// "b135fd4bed9be2a988e0376d1bb0977fcb8b6a88ec9f35da8138fa49eb9a0d50";
// const baseURL = "https://api.together.xyz/v1";

export const getLlmOpenaiClient = (name?:string) => {
  const _configName = name || "chat";
  const llm_config = llm_configs.llms.find(llm => llm.id === _configName);
  if (!llm_config) {
    throw new Error(`Llm config not found: ${name}`);
  }

  const { base_url, api_key } = llm_config;
  const openAiClient = createOpenAI({
		baseURL: base_url,
		apiKey: api_key,
	});
	// const model = "meta-llama/Llama-3-8b-chat-hf";

  let modelName = llm_config.model;
  //处理 model 的前缀名
	const all_llm_providers_prefix = ["together_ai/", "groq/"]
	if(all_llm_providers_prefix.some(prefix => modelName.startsWith(prefix))){
		modelName = modelName.slice(modelName.indexOf("/") + 1);
	}
	const openaiModel = openAiClient(modelName);
  return openaiModel

}
