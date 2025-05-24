import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import { WorkflowRunInputDialog } from "../components/workflow-run-input";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/input")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);

  return <div>{shape.data && <WorkflowRunInputDialog run={shape.data} />}</div>;
}
