import { createLazyFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { NavWorkflow } from "../~workflows/siderbar";
export const Route = createLazyFileRoute("/browser")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <WorkbrenchProvider>
        <RootAppWrapper secondSidebar={<NavWorkflow />}>
          <DashHeaders>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>TK</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DashHeaders>
          <Outlet />
        </RootAppWrapper>
      </WorkbrenchProvider>
    </>
  );
}
