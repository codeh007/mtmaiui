// implementing https://www.anthropic.com/research/building-effective-agents

import { type OpenAIProvider, createOpenAI } from "@ai-sdk/openai";
import { Agent, type AgentNamespace, type Connection, type WSMessage } from "agents";

type Env = {
  OPENAI_API_KEY: string;
  AI_GATEWAY_TOKEN: string;
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
  Sequential: AgentNamespace<Agent<Env>>;
  Routing: AgentNamespace<Agent<Env>>;
  Parallel: AgentNamespace<Agent<Env>>;
  Orchestrator: AgentNamespace<Agent<Env>>;
  Evaluator: AgentNamespace<Agent<Env>>;
};

// createAgent is a helper function to generate an agent class
// with helpers for sending/receiving messages to the client and updating the status
export function createAgent<
  Props extends Record<string, unknown>,
  Output extends Record<string, unknown>,
>(
  name: string,
  workflow: (
    props: Props,
    ctx: {
      toast: (message: string) => void;
      openai: OpenAIProvider;
    },
  ) => Promise<Output>,
) {
  return class AnthropicAgent extends Agent<Env> {
    openai = createOpenAI({
      apiKey: this.env.OPENAI_API_KEY,
      baseURL: `https://gateway.ai.cloudflare.com/v1/${this.env.AI_GATEWAY_ACCOUNT_ID}/${this.env.AI_GATEWAY_ID}/openai`,
      headers: {
        "cf-aig-authorization": `Bearer ${this.env.AI_GATEWAY_TOKEN}`,
      },
    });
    static options = {
      hibernate: true,
    };
    status: {
      isRunning: boolean;
      output: string | undefined;
    } = {
      isRunning: false,
      output: undefined,
    };

    onConnect(connection: Connection) {
      connection.send(
        JSON.stringify({
          type: "status",
          status: this.status,
        }),
      );
    }

    toast = (message: string, type: "info" | "error" = "info") => {
      this.broadcast(
        JSON.stringify({
          type: "toast",
          toast: {
            message,
            type,
          },
        }),
      );
    };

    onMessage(connection: Connection, message: WSMessage) {
      const data = JSON.parse(message as string);
      switch (data.type) {
        case "run":
          this.run({ input: data.input });
          break;
        case "stop":
          this.setStatus({ ...this.status, isRunning: false });
          break;
        default:
          console.error("Unknown message type", data.type);
      }
    }

    setStatus(status: typeof this.status) {
      this.status = status;
      this.broadcast(JSON.stringify({ type: "status", status: this.status }));
    }

    async run(data: { input: Record<string, string> }) {
      if (this.status.isRunning) return;
      this.setStatus({ isRunning: true, output: undefined });

      try {
        const result = await workflow(data.input as Props, {
          toast: this.toast,
          openai: this.openai,
        });
        this.setStatus({ isRunning: false, output: JSON.stringify(result) });
      } catch (error) {
        this.toast(`An error occurred: ${error}`);
        this.setStatus({ isRunning: false, output: JSON.stringify(error) });
      }
    }
  };
}
