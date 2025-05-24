import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { RootAppWrapper } from "../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { NavResource } from "./siderbar";

export const Route = createLazyFileRoute("/resource")({
  component: RouteComponent,
});

function RouteComponent() {
  const matches = useRouterState({ select: (s) => s.matches });
  const breadcrumbs = matches
    .filter((match) => match.context.getTitle)
    .map(({ pathname, context }) => {
      return {
        title: context.getTitle(),
        path: pathname,
      };
    });

  return (
    <WorkbrenchProvider>
      <RootAppWrapper secondSidebar={<NavResource />}>
        <Outlet />
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
