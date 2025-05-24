import type { ChatAgentContainerState } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface AssistantAgentStateViewProps {
  state: ChatAgentContainerState;
}
export const AssistantAgentStateView = ({
  state,
}: AssistantAgentStateViewProps) => {
  return (
    <div className="bg-yellow-100 p-2 rounded-md">
      AssistantAgentStateView
      <DebugValue data={state} />
    </div>
  );
};
