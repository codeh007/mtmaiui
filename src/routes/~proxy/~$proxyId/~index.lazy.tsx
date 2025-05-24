import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/proxy/$proxyId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { proxyId } = Route.useParams();
  return (
    <>
      <div>{proxyId}</div>
    </>
  );
}
