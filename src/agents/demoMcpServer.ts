import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

// type Props = {
//   login: string;
//   name: string;
//   email: string;
//   accessToken: string;
// };

// const ALLOWED_EMAILS = new Set(["<INSERT EMAIL>"]);
type State = { counter: number };
export class DemoMcpServer extends McpAgent<Env, State, {}> {
  server = new McpServer(
    {
      name: "mcp-demo-server",
      version: "1.0.0",
    },
    { capabilities: { logging: {} } },
  );

  initialState: any = {
    counter: 1,
  };
  async init() {
    console.log("mcp demo server init");
    this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }],
    }));
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      return {
        contents: [{ uri: uri.href, text: "hello123 resource" }],
      };
    });
    //export type PromptCallback<Args extends undefined | PromptArgsRawShape = undefined> = Args extends PromptArgsRawShape ? (args: z.objectOutputType<Args, ZodTypeAny>, extra: RequestHandlerExtra) => GetPromptResult | Promise<GetPromptResult> : (extra: RequestHandlerExtra) => GetPromptResult | Promise<GetPromptResult>;

    const schema = z.object({
      code: z.string(),
    });
    this.server.prompt("review-code", schema, ({ code }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review this code:\n\n${code}`,
          },
        },
      ],
    }));
    console.log("mcp demo server init done");
  }
  onStateUpdate(state: any) {
    console.log({ stateUpdate: state });
  }
}
