import { routeAgentRequest } from "agents";
//来自: https://github.com/cloudflare/agents/blob/main/packages/hono-agents/src/index.ts
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";

import type { AgentOptions } from "agents";
import type { Context, Env } from "hono";

const mountPrefix = "api";

/**
 * Configuration options for the Cloudflare Agents middleware
 */
type AgentMiddlewareContext<E extends Env> = {
  options?: AgentOptions<E>;
  onError?: (error: Error) => void;
};

export function agentsMiddleware<E extends Env = Env>(ctx?: AgentMiddlewareContext<E>) {
  return createMiddleware<Env>(async (c, next) => {
    try {
      console.log("agentsMiddleware", c.req.url);
      const handler = isWebSocketUpgrade(c) ? handleWebSocketUpgrade : handleHttpRequest;

      const response = await handler(c, ctx?.options);

      return response === null ? await next() : response;
    } catch (error) {
      if (ctx?.onError) {
        ctx.onError(error as Error);
        return next();
      }
      throw error;
    }
  });
}

/**
 * Checks if the incoming request is a WebSocket upgrade request
 * Looks for the 'upgrade' header with a value of 'websocket' (case-insensitive)
 */
function isWebSocketUpgrade(c: Context): boolean {
  return c.req.header("upgrade")?.toLowerCase() === "websocket";
}

/**
 * Handles WebSocket upgrade requests
 * Returns a WebSocket upgrade response if successful, null otherwise
 */
async function handleWebSocketUpgrade<E extends Env>(c: Context<E>, options?: AgentOptions<E>) {
  const response = await routeAgentRequest(c.req.raw, env(c) satisfies Env, {
    ...options,
    prefix: mountPrefix,
  });

  if (!response?.webSocket) {
    return null;
  }

  return new Response(null, {
    status: 101,
    webSocket: response.webSocket,
  });
}

async function handleHttpRequest<E extends Env>(c: Context<E>, options?: AgentOptions<E>) {
  const auth = c.get("authUser");
  console.log("(agent middleware)auth", auth);
  return routeAgentRequest(c.req.raw, env(c) satisfies Env, {
    ...options,
    cors: true,
    prefix: mountPrefix,
  });
}
