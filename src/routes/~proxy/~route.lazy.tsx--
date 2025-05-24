import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { NavProxy } from "./siderbar";

export const Route = createLazyFileRoute("/proxy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <RootAppWrapper secondSidebar={<NavProxy />}>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>代理服务器</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <Outlet />
      </RootAppWrapper>
    </>
  );
}
