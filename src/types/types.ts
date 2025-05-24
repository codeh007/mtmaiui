import type { TabOption } from "../routes/~workflow-runs/components/step-run-detail/step-run-detail";

export interface Participant {
  id: string;
  name: string;
}

export interface WorkflowRunSidebarState {
  workflowRunId?: string;
  stepRunId?: string;
  defaultOpenTab?: TabOption;
}
