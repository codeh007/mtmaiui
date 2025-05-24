"use client";
import { useTenantId } from "@mtmaiui/hooks/useAuth";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { ClickToComponent } from "click-to-react-component";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { UserFAB } from "../components/UserFAB";
import { NotFound } from "../components/notFound";

interface MyRouterContext {
  // tid: string;
  queryClient: QueryClient;
  serverUrl: string;
}

// Use the routerContext to create your root route
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "MtmAI UI",
      },
    ],
  }),
});

export const RootRoute = Route;

function RootComponent() {
  const tid = useTenantId();
  // const { serverUrl } = useRouterContext();
  return (
    <MtSuspenseBoundary>
      <ClickToComponent />
      <UserFAB />
      <Outlet />
    </MtSuspenseBoundary>
  );
}
