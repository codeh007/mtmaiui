import type { WorkflowRunShape } from "mtmaiapi";

export function hasChildSteps(shape: WorkflowRunShape) {
  return shape.jobRuns?.some((jobRun) => {
    return jobRun.job?.steps.some((step) => {
      return step?.parents?.length;
    });
  });
}
