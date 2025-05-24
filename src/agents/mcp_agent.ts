import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import type { MCPAgentState } from "../agent_state/mcp_agent_state";

/**
 * 实现Mcp Server
 */
export class MyMcpAgent extends McpAgent<Env, MCPAgentState> {
  server = new McpServer({
    name: "my-mcp-agent",
    version: "1.0.0",
  });

  async addMcpServer(url: string): Promise<string> {
    console.log(`Registering server: ${url}`);
    // const authProvider = new DurableObjectOAuthClientProvider(
    //   this.ctx.storage,
    //   this.name,
    //   `${this.env.HOST}/agents/my-agent/${this.name}/callback`,
    // );
    // const { id, authUrl } = await this.mcp.connect(url, {
    //   transport: { authProvider },
    // });
    // this.setServerState(id, {
    //   url,
    //   authUrl,
    //   state: this.mcp.mcpConnections[id].connectionState,
    // });
    // if (this.mcp.mcpConnections[id].connectionState === "ready") {
    //   await this.refreshServerData();
    // }
    // return authUrl ?? "";
    return "fake-auth-url--111";
  }

  async init() {
    console.log("my-mcp-agent initV2");
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      return {
        contents: [{ uri: uri?.href, text: String(this.state?.counter) }],
      };
    });

    // 提示: typescript 存在循环类型, 会导致IDE保存代码的时候等待很久时间. 并且不会由明确报错或警告
    // this.server.tool(
    //   "add",
    //   "Add to the counter, stored in the MCP",
    //   { a: z.number() as z.ZodType<number> },
    //   async ({ a }) => {
    //     this.setState({ ...this.state, counter: this.state.counter + a });

    //     return {
    //       content: [
    //         {
    //           type: "text",
    //           text: String(`Added ${a}, total is now ${this.state.counter}`),
    //         },
    //       ],
    //     };
    //   },
    // );
  }
  // onStateUpdate(state: MCPAgentState) {
  //   console.log("my-mcp-agent onStateUpdate", state);
  //   console.log({ stateUpdate: state });
  // }
}
