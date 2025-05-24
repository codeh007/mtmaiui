import type { Prompt, Resource, Tool } from "@modelcontextprotocol/sdk/types.js";
import type { UIMessage } from "ai";
import type { McpServer } from "./shared";

export type RootAgentState = {
  counter: number;
  color: string;
  mainViewType: "chat" | "scheduler";
  chatHistoryIds: string[];

  // mcp client settings
  mcpServers: Record<string, McpServer>;
  mcpTools: (Tool & { serverId: string })[];
  mcpPrompts: (Prompt & { serverId: string })[];
  mcpResources: (Resource & { serverId: string })[];
  currentMcpServer?: McpServer;

  //
  mainAccessToken?: string;
  agentRunnerUrl?: string;
  // 本地运行, 表示有浏览器客户端直接调用 agent worker 这样调试方便.
  // 否则, 由 cloudflare agent 来运行
  isAgentRunLocal?: boolean;
};

export type AgentRunRequest = {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: UIMessage;
  streaming: boolean;
};
