import { createOpenAI } from "@ai-sdk/openai";
import { streamText as aiSdkStreamText, convertToCoreMessages } from "ai";
import { getLlmOpenaiClient } from "./llm_config";

interface ToolResult<Name extends string, Args, Result> {
	toolCallId: string;
	toolName: Name;
	args: Args;
	result: Result;
}

interface Message {
	role: "user" | "assistant";
	content: string;
	toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof aiSdkStreamText>[0], "model">;

export async function streamTextV2(
	messages: Messages,
	env,
	systemPrompt?: string,
	options?: StreamingOptions,
) {
	const openaiModel = getLlmOpenaiClient();


	const result = await aiSdkStreamText({
		model: openaiModel,
		system: systemPrompt,
		messages: convertToCoreMessages(messages as []),
		...options,
	});
	return result;
}


async function callDefaultLlm(req: Request) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { messages } = (await req.json()) as any;

	const apiKey =
		"b135fd4bed9be2a988e0376d1bb0977fcb8b6a88ec9f35da8138fa49eb9a0d50";
	const baseURL = "https://api.together.xyz/v1";

	const openAiClient = createOpenAI({
		baseURL: baseURL,
		apiKey: apiKey,
	});
	const model = "meta-llama/Llama-3-8b-chat-hf";
	const openaiModel = openAiClient(model);

	const result = await aiSdkStreamText({
		model: openaiModel,
		messages,
	});

	return result.toDataStreamResponse();
}
