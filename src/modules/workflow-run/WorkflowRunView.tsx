"use Client";

import type { WorkflowRun } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

export const WorkflowRunView = ({
  workflowRun,
}: { workflowRun: WorkflowRun }) => {
  return (
    <div>
      <DebugValue data={{ workflowRun }} />
    </div>
  );
};
