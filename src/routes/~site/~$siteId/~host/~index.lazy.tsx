import { createLazyFileRoute } from "@tanstack/react-router";

import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { SiteHostListView } from "./SiteHostListView";

export const Route = createLazyFileRoute("/site/$siteId/host/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const tid = useTenantId();
  return (
    <>
      <SiteHostListView siteId={siteId} tid={tid} />
    </>
  );
}
