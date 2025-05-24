import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../../../hooks/useWorkflowRun";
import { StepRunDetail } from "../../../components/step-run-detail/step-run-detail";

export const Route = createLazyFileRoute(
  "/workflow-runs/$workflowRunId/stepRun/$stepRunId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { stepRunId } = Route.useParams();
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);
  return (
    <>
      <StepRunDetail stepRunId={stepRunId} workflowRun={shape.data} />
    </>
  );
}
