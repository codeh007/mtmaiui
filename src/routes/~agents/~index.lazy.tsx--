import { createLazyFileRoute } from "@tanstack/react-router";
import { useAgent } from "agents/react";
import type { RootAgentState } from "mtmaiapi";
import { useState } from "react";
import type { OutgoingMessage } from "../../agent_state/shared";
import { CfAgentChatView } from "../../components/chatv3/CfAgentChatView";

export const Route = createLazyFileRoute("/agents/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [rootState, setRootState] = useState<RootAgentState>();

  const rootAgent = useAgent<RootAgentState>({
    agent: "root_ag",
    name: "default",

    onStateUpdate: (newState) => setRootState(newState),

    onMessage: (message) => {
      const parsedMessage = JSON.parse(message.data) as OutgoingMessage;
      if (parsedMessage?.type === "connected") {
        console.log("agent client connected");
      } else if (parsedMessage.type === "runSchedule") {
        console.log("run schedule", parsedMessage);
      } else if (parsedMessage?.type === "error") {
        console.log("error", parsedMessage);
      } else if (parsedMessage?.type === "schedule") {
        console.log("schedule", parsedMessage);
      } else if (parsedMessage?.type === "demo-event-response") {
        console.log("demo-event-response", parsedMessage);
      } else if (parsedMessage?.type === "require-main-access-token") {
        console.log("require-main-access-token", parsedMessage);
      } else {
        console.log("scheduler client, 未知错误", message);
      }
    },
  });
  return (
    <>
      <div className="flex gap-2">
        <div className="flex-1 w-full">
          <CfAgentChatView agentName="chat" agentId="chat1" />
        </div>
      </div>
    </>
  );
}
