import { Hono } from "hono";
// import { DemoMcpServer } from "../../../agents/demoMcpServer";

const mcpSseRoute = new Hono<{ Bindings: Env }>();

mcpSseRoute.all("/sse/*", (c) => {
  /**
   * 问题排查:
   *    1: 路径前缀需要对应
   *    2: binding 字符串,必须是wrangler 中已经配置的 durable object 名称
   */
  const handler = DemoMcpServer.mount("/sse", { binding: "DemoMcpServer" });
  const response = handler.fetch(c.req.raw, c.env, c.executionCtx);
  return response;
});

export default mcpSseRoute;
