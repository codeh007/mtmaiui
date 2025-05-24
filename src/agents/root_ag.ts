import type { Session } from "@auth/core/types";
import type { Connection, ConnectionContext } from "agents";
import { Agent } from "agents";
import { MCPClientManager } from "agents/mcp/client";
// import { OutgoingMessage, IncomingMessage } from "http";
// import { RootAgentState, McpServer } from "mtmaiapi";
// import type { RootAgentState } from "../agent_state/root_agent_state";
// import type { McpServer } from "../agent_state/shared";
// import type { IncomingMessage, OutgoingMessage } from "../agent_state/shared";

export class RootAg extends Agent<Env, RootAgentState> {
  mcpClientManager = new MCPClientManager("mcp-clients", "1.0.0");
  initialState = {
    counter: 0,
    color: "#3B82F6",
    mainViewType: "chat",
    chatHistoryIds: [],
    mcpServers: {},
    mcpTools: [],
    mcpPrompts: [],
    mcpResources: [],
  } satisfies RootAgentState;

  onStart(): void | Promise<void> {}
  onConnect(connection: Connection, ctx: ConnectionContext) {
    // const auth = ctx.request.headers.get("authorization");
    // console.log("auth", auth);

    connection.send(
      JSON.stringify({
        type: "connected",
        data: {
          message: "Hello, world! connected",
        },
      } satisfies OutgoingMessage),
    );
  }

  onClose(connection: Connection) {
    console.log("root ag disconnected:", connection.id);
  }
  onRequest(request: Request): Response | Promise<Response> {
    const timestamp = new Date().toLocaleTimeString();
    return new Response(`Server time: ${timestamp} - Your request has been processed!`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as IncomingMessage;

    if (event.type === "schedule") {
    } else if (event.type === "delete-schedule") {
      await this.cancelSchedule(event.id);
    } else if (event.type === "demo-event-1") {
      await this.onDemoEvent1(event.data);
    } else if (event.type === "set-mcp-server") {
      await this.onSetMcpServer(event.data);
    } else if (event.type === "set-user-session") {
      await this.onSetUserSession(event.data);
    } else if (event.type === "call-adk") {
      await this.onCallAdk(event.data);
    } else {
      console.log("root ag unknown message", event);
    }
  }

  async onSetMcpServer(playload: McpServer) {
    console.log("setMcpServer", playload);
    this.setState({
      ...this.state,
      currentMcpServer: playload,
    });
  }

  async onSetUserSession(session: Session) {
    // console.log("(root ag) setUserSession", session);
  }
  async refreshMcpServerData() {
    console.log("my-mcp-agent refreshServerData");
    this.setState({
      ...this.state,
      mcpPrompts: this.mcpClientManager.listPrompts(),
      mcpTools: this.mcpClientManager.listTools(),
      mcpResources: this.mcpClientManager.listResources(),
    });
  }
  async onDemoEvent1(payload: unknown) {
    this.broadcast(
      JSON.stringify({
        type: "demo-event-response",
        data: payload,
      } satisfies OutgoingMessage),
    );
  }

  async onCallAdk(payload: unknown) {
    const adkEndpoint = "http://localhost:7860/run_sse_v2";

    const postData = {
      app_name: "root",
      user_id: "user",
      session_id: "a16c95ef-eb45-496d-9c88-f95406f12e3b",
      new_message: {
        role: "user",
        parts: [
          {
            text: "你好",
          },
        ],
      },
      streaming: false,
    };

    const response = await fetch(adkEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get reader from response body");
    }

    try {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        buffer += text;

        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

        for (const line of lines) {
          if (line.trim() === "") continue;
          if (line === "data: [DONE]") {
            console.log("Adk SSE message: [DONE]");
            return;
          }

          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);
              console.log("Adk SSE message:", data);
            } catch (e) {
              console.error("(Adk sse) Failed to parse SSE message:", line);
              console.error("Parse error:", e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
