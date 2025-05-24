import { RootAppWrapper } from "@mtmaiui/components/RootAppWrapper";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";

export const Route = createLazyFileRoute("/sandbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RootAppWrapper>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>sandbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <Outlet />
      </RootAppWrapper>
    </>
  );
}
