"use client";

import { useAgent } from "agents/react";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useState } from "react";
import { AgentNames } from "../../agent_state/shared";
import type { ShortVideoAgentState } from "../../agents/shortvideo/shortvideo_agent_state";
import { useWorkbenchStore } from "../../stores/workbrench.store";

interface ShortVideoAgentViewProps {
  agentId: string;
}
export const ShortVideoAgentView = ({ agentId }: ShortVideoAgentViewProps) => {
  const [shortVideoAgentState, setShortVideoAgentState] = useState<
    ShortVideoAgentState | undefined
  >();

  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);
  const isDebug = useWorkbenchStore((state) => state.isDebug);

  const shortVideoAgent = useAgent<ShortVideoAgentState>({
    agent: AgentNames.shortVideoAg,
    host: new URL(agentUrl).host,
    prefix: agentPathPrefix,
    name: agentId,
    onStateUpdate: (newState) => setShortVideoAgentState(newState),
  });
  return (
    <div className="w-full h-full">
      {isDebug && <DebugValue data={shortVideoAgentState} />}
      {/* {shortVideoAgentState && <MainSencePlayer mainSenceData={shortVideoAgentState.mainSence} />} */}
    </div>
  );
};
