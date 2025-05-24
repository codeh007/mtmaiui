import { createLazyFileRoute } from "@tanstack/react-router";
import { ProxyForm } from "../ProxyForms";

export const Route = createLazyFileRoute("/proxy/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ProxyForm />
    </>
  );
}
