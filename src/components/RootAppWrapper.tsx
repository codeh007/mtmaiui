"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
import { SidebarInset, SidebarProvider } from "mtxuilib/ui/sidebar";
import type { PropsWithChildren } from "react";
import { DashSidebar } from "./sidebar/siderbar";

interface RootAppWrapperProps extends PropsWithChildren {
  secondSidebar?: React.ReactNode;
  className?: string;
}
export function RootAppWrapper({
  children,
  className,
  secondSidebar,
}: RootAppWrapperProps) {
  return (
    <SidebarProvider
      className="min-h-none"
      style={
        {
          "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "fixed flex flex-1 top-0 left-0 w-full h-full z-30",
          className,
        )}
      >
        <DashSidebar secondSidebar={secondSidebar} />
        <SidebarInset>
          <MtSuspenseBoundary>{children}</MtSuspenseBoundary>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
