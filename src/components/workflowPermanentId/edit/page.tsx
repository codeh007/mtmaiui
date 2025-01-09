"use client";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { DashSidebar } from "../../sidebar/siderbar";

export default function Page(props: {
  params: {
    workflowPermanentId: string;
  };
}) {
  const { workflowPermanentId } = props.params;
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        {/* <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>编辑工作流</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header> */}
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<SkeletonListview />}>
            <MtErrorBoundary>
              {/* <WorkflowEditor workflowPermanentId={workflowPermanentId} /> */}
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}
