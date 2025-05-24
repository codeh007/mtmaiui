import type { OpenAPIHono } from "@hono/zod-openapi";
import { agentsMiddleware } from "./agentsMiddleware";
import type { Bindings } from "./types";

//文档: https://github.com/honojs/middleware/tree/main/packages/auth-js
export default function configureAgents(app: OpenAPIHono<{ Bindings: Bindings }>) {
  // 设置 cloudflare agents 中间件
  app.use(
    "/agents/*",
    agentsMiddleware({
      onError: (error) => {
        console.log("aggents onError", error);
        return new Response(`error:${error}`, { status: 401 });
      },
      options: {
        // 设置前缀:
        prefix: "agents", // Handles /agents/* routes only
        cors: true,
        // 在连接之前验证请求
        onBeforeConnect: async (req) => {
          const token = req.headers.get("authorization");
          // validate token
          // if (!token) return new Response("(agents)Unauthorized", { status: 401 });
        },
      },
    }),
  );
}
