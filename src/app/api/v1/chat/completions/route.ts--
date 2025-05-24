import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { getLlmConfig } from "../config.ts--";

export const runtime = "edge";

/**
 * 给定 openai completion 请求, 返回完全接口兼容的 completion 响应
 * 要求: 使用 fetch实现.
 * @param req
 */
const handler = async (req: Request) => {
  try {
    const body = (await req.json()) as ChatCompletionCreateParams;
    const defaultLlm = await getLlmConfig();

    // 远端真正的模型名称
    const remoteModel = body.model || defaultLlm.model;
    // Forward request to LLM API
    const response = await fetch(`${defaultLlm.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${defaultLlm.apiKey}`,
      },
      body: JSON.stringify({
        ...body,
        model: remoteModel,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          message: (error as Error).message,
          type: "api_error",
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};

export const POST = handler;
export const GET = handler;
