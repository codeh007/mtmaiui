import { Outlet } from "@tanstack/react-router";

import { createLazyFileRoute } from "@tanstack/react-router";
import { SidebarProvider } from "mtxuilib/ui/sidebar";
import { RootAppWrapper } from "../../components/RootAppWrapper";
// import { PlatformAccountHeader } from "./headers";
import { NavPlatformAccount } from "./siderbar";

export const Route = createLazyFileRoute("/platform-account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      className="min-h-none"
      style={
        {
          "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
        } as React.CSSProperties
      }
    >
      <RootAppWrapper secondSidebar={<NavPlatformAccount />}>
        <Outlet />
      </RootAppWrapper>
    </SidebarProvider>
  );
}
