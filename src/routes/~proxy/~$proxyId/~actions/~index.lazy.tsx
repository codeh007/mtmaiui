import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/proxy/$proxyId/actions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>TODO: 代理服务器操作</div>;
}
