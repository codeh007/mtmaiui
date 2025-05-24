import type { SocialTeamManagerState } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface SocialTeamManagerStateViewProps {
  state: SocialTeamManagerState;
}
export const SocialTeamManagerStateView = ({
  state,
}: SocialTeamManagerStateViewProps) => {
  return (
    <div className="bg-green-100 p-2 rounded-md">
      SocialTeamManagerStateView
      <DebugValue data={state} />
    </div>
  );
};
