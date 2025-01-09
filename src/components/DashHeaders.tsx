"use client";
import { cn } from "mtxuilib/lib/utils";
import { Suspense } from "react";
import { SidebarToggle } from "./sidebar/sidebar-toggle";
import { Separator } from "mtxuilib/ui/separator";

interface DashHeadersProps {
  borderBottom?: boolean;
  children?: React.ReactNode;
}
export const DashHeaders = (props: DashHeadersProps) => {
  return (
    <Suspense fallback={<>loading...</>}>
      <header
        className={cn(
          "sticky top-0 flex shrink-0 items-center gap-2 bg-background p-4",
          {
            // TODO: 默认没下划线，滚动后有下划线
            // "border-b": props.borderBottom,
          },
        )}
      >
        <SidebarToggle className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {props.children}
      </header>
    </Suspense>
  );
};
