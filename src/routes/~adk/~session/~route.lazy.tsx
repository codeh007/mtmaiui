import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";
import { NavAdkSession } from "./siderbar";

export const Route = createLazyFileRoute("/adk/session")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <WorkbrenchProvider>
        <RootAppWrapper secondSidebar={<NavAdkSession />}>
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
    </>
  );
}
