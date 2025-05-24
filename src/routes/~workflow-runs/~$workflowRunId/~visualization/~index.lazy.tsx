import { createLazyFileRoute } from "@tanstack/react-router";
import { useWorkflowRunShape } from "../../../../hooks/useWorkflowRun";
import { MiniMap } from "../../components/mini-map";
import { ViewToggle } from "../../components/view-toggle";
import WorkflowRunVisualizer from "../../components/workflow-run-visualizer-v2";
import { hasChildSteps } from "../../components/workflow_utils";

export const Route = createLazyFileRoute(
  "/workflow-runs/$workflowRunId/visualization/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);
  const view: "graph" | "minimap" = "graph";
  return (
    <>
      <div className="w-full h-fit flex overflow-auto relative bg-slate-100 dark:bg-slate-900">
        {shape.data && view === "graph" && hasChildSteps(shape.data) && (
          <WorkflowRunVisualizer
            shape={shape.data}
            // selectedStepRunId={sidebarState?.stepRunId}
            setSelectedStepRunId={(stepRunId) => {
              // setSidebarState({
              //   stepRunId,
              //   defaultOpenTab: TabOption.Output,
              //   workflowRunId: workflowRunId,
              // });
            }}
          />
        )}
        {shape.data && (view === "minimap" || !hasChildSteps(shape.data)) && (
          <MiniMap
            shape={shape.data}
            // selectedStepRunId={sidebarState?.stepRunId}
            // onClick={(stepRunId, defaultOpenTab?: TabOption) =>
            //   // setSidebarState(
            //   //   stepRunId === sidebarState?.stepRunId
            //   //     ? undefined
            //   //     : {
            //   //         stepRunId,
            //   //         defaultOpenTab,
            //   //         workflowRunId: workflowRunId,
            //   //       },
            //   // )
            // }
          />
        )}
        {shape.data && <ViewToggle shape={shape.data} />}
      </div>
    </>
  );
}
