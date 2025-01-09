import type { components } from "mtmaiapi/query_client/generated";
export type WorkflowRun = components["schemas"]["WorkflowRun"];
export type StepRun = components["schemas"]["StepRun"];
export type WorkflowRunShape = components["schemas"]["WorkflowRunShape"];
export type Step = components["schemas"]["Step"];
export type Blog = components["schemas"]["Blog"];
export type LogLineOrderByDirection =
  components["schemas"]["LogLineOrderByDirection"];
export interface HubmanInput {
  message: string;
  resource?: string;
  resourceId?: string;
}
