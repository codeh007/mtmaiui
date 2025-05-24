import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import { RootRoute } from "../../~__root";
import { RunSummary } from "../components/RunSummary";
import { StepRunEvents } from "../components/step-run-events-for-workflow-run";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);
  const nav = RootRoute.useNavigate();

  return (
    <div className="mx-auto max-w-7xl pt-2 px-4 sm:px-6 lg:px-8">
      <div className="h-4" />
      <RunSummary data={shape.data} />
      <StepRunEvents
        workflowRun={shape.data}
        onClick={(stepRunId) => nav({ to: `stepRun/${stepRunId}` })}
      />
    </div>
  );
}
