import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../../components/RootAppWrapper";

export const Route = createLazyFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper>
      <Outlet />
    </RootAppWrapper>
  );
}
