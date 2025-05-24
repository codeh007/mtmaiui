import type { useAgent } from "agents/react";
import { Button } from "mtxuilib/ui/button";
import type { RootAgentState } from "../../agent_state/root_agent_state";
import type { IncomingMessage, McpServer } from "../../agent_state/shared";

interface McpServerViewProps {
  agent: ReturnType<typeof useAgent<RootAgentState>>;
}
export const McpServerView = ({ agent }: McpServerViewProps) => {
  const demoMcpServerUrl = "https://mcp-server-demo.com";

  const handleAddMcpServer = () => {
    agent.send(
      JSON.stringify({
        type: "add-mcp-server",
        data: {
          url: demoMcpServerUrl,
          state: "ready",
        },
      } satisfies IncomingMessage),
    );
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {/* <input type="text" ref={mcpInputRef} className="mcp-input" placeholder="MCP Server URL" /> */}
        <Button type="button" onClick={handleAddMcpServer}>
          Add MCP Server
        </Button>
      </div>
    </div>
  );
};

interface CurrentMcpServerViewProps {
  mcpServer: McpServer;
}
export const CurrentMcpServerView = ({ mcpServer }: CurrentMcpServerViewProps) => {
  return (
    <div className="flex flex-row gap-2 bg-blue-100 p-2 rounded-md">
      <div>{mcpServer.url}</div>
    </div>
  );
};
