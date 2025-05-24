import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../../components/RootAppWrapper";

export const Route = createLazyFileRoute("/scheduled-runs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RootAppWrapper>
        <Outlet />
      </RootAppWrapper>
    </>
  );
}
