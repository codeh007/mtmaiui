import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

import { DashContent, DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { DashSidebar } from "../../components/sidebar/siderbar";
export const Route = createLazyFileRoute("/envs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Workflows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  );
}
