import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useEffect, useState } from "react";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";
import type { WorkflowRunSidebarState } from "../../../types/types";
import { RunDetailHeader } from "./header";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);
  const [sidebarState, setSidebarState] = useState<WorkflowRunSidebarState>();
  const additionalMetadata = shape.data?.additionalMetadata;
  useEffect(() => {
    if (
      sidebarState?.workflowRunId &&
      workflowRunId !== sidebarState?.workflowRunId
    ) {
      setSidebarState(undefined);
    }
  }, [workflowRunId, sidebarState]);
  return (
    <>
      <WorkbrenchProvider
        componentId={additionalMetadata?.componentId as string}
        sessionId={additionalMetadata?.sessionId as string}
      >
        <RunDetailHeader
          loading={shape.isLoading}
          data={shape.data}
          refetch={() => shape.refetch()}
        />

        <div className="flex-grow h-full w-full">
          <MtSuspenseBoundary>
            <Outlet />
          </MtSuspenseBoundary>
        </div>
      </WorkbrenchProvider>
    </>
  );
}
