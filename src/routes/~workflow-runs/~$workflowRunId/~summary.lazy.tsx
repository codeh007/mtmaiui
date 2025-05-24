import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/workflow-runs/$workflowRunId/summary",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/workflow-runs/$workflowRunId/summary"!</div>;
}
