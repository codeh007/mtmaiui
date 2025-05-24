import { RootAppWrapper } from "@mtmaiui/components/RootAppWrapper";
import { WorkbrenchProvider } from "@mtmaiui/stores/workbrench.store";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";

export const Route = createLazyFileRoute("/automate")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <WorkbrenchProvider>
        <RootAppWrapper>
          <DashHeaders>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>自动化操作</BreadcrumbPage>
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
