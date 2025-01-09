"use client";
import { WorkflowTable } from "../workflow/workflow-table";

import { Suspense } from "react";
import { DashContent } from "../DashContent";
import { DashHeaders } from "../DashHeaders";
import { DashSidebar } from "../sidebar/siderbar";
import { SidebarInset } from "mtxuilib/ui/sidebar";

export default function Page() {
  return (
    <>
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
            <WorkflowTable />
          </Suspense>
        </DashContent>
      </SidebarInset>
    </>
  );
}
