"use client";

import type { WorkflowRunShape } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { BiExitFullscreen, BiExpand } from "react-icons/bi";
import { useMtmai } from "../../../stores/MtmaiProvider";
import { hasChildSteps } from "./workflow_utils";

type Props = {
  shape: WorkflowRunShape;
};

export const ViewToggle: React.FC<Props> = ({ shape }) => {
  const view = useMtmai((x) => x.preferredWorkflowRunView);
  const setView = useMtmai((x) => x.setPreferredWorkflowRunView);
  const otherView = view === "graph" ? "minimap" : "graph";

  // only render if there are at least two dependent steps, otherwise the view toggle is not needed
  if (!hasChildSteps(shape)) {
    return null;
  }

  return (
    <div className="sticky ml-auto mt-auto bottom-2 right-2 z-20">
      <Button variant="outline" size="icon" onClick={() => setView(otherView)}>
        {view === "minimap" && <BiExpand />}
        {view === "graph" && <BiExitFullscreen />}
      </Button>
    </div>
  );
};

// export function hasChildSteps(shape: WorkflowRunShape) {
//   return shape.jobRuns?.some((jobRun) => {
//     return jobRun.job?.steps.some((step) => {
//       return step?.parents?.length;
//     });
//   });
// }
