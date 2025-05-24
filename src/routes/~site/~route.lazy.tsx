import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

import { WorkbrenchProvider } from "@mtmaiui/stores/workbrench.store";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { SiteSidebar } from "./siderbar";
export const Route = createLazyFileRoute("/site")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <RootAppWrapper secondSidebar={<SiteSidebar />}>
        {/* <DashHeaders>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Adk会话</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </DashHeaders> */}
        <Outlet />
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
