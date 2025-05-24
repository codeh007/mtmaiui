"use client";

import { useAgent } from "agents/react";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useState } from "react";
import type {
  WorkerAgentOutgoingMessage,
  WorkerAgentState,
} from "../../agent_state/workerAgentState";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function WorkerAgentView() {
  const [workerAgentState, setWorkerAgentState] = useState<WorkerAgentState>();
  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentHost = new URL(agentUrl).host;
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);
  const workerAgent = useAgent<WorkerAgentState>({
    agent: "worker-agent",
    id: "default",
    host: agentHost,
    prefix: agentPathPrefix,
    onStateUpdate: (newState) => setWorkerAgentState(newState),
    onMessage: (message) => {
      console.log("(worker agent)onMessage", message?.data?.type);
      const parsedMessage = JSON.parse(message.data) as WorkerAgentOutgoingMessage;
      if (parsedMessage?.type === "new_worker_connected") {
        console.log("new worker connected", parsedMessage);
      } else if (parsedMessage?.type === "log") {
        console.log("worker agent log:", parsedMessage);
      } else {
        console.warn("worker agent onMessage: 未知消息", message);
      }
    },
  });
  return (
    <div className="w-1/3 rounded-md border border-gray-300 bg-gray-100 p-2">
      <DebugValue data={{ workerAgentState }} />
      <div>total worker count: {workerAgentState?.totalWorkers}</div>
    </div>
  );
}
