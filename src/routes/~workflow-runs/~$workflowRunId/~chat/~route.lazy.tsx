import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/workflow-runs/$workflowRunId/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { workflowRunId } = Route.useParams();
  // const { shape } = useWorkflowRunShape(workflowRunId);

  // const additionalMetadata = shape.data?.additionalMetadata;

  return (
    <>
      <Outlet />
    </>
  );
}
