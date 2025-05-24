import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ResourceHeader } from "./header";

export const Route = createLazyFileRoute("/resource/$resId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { resId } = Route.useParams();
  const setResourceId = useWorkbenchStore((x) => x.setResourceId);
  const resourceId = useWorkbenchStore((x) => x.resourceId);
  useEffect(() => {
    setResourceId(resId);
  }, [resId, setResourceId]);
  return (
    <>
      <ResourceHeader resId={resId} />
      resId: {resourceId}
      <Outlet />
    </>
  );
}
