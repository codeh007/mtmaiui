"use client";

import { File, Inbox } from "lucide-react";
import { cn } from "mtxuilib/lib/utils";
import { Separator } from "mtxuilib/ui/separator";
import { useSelectedLayoutSegments } from "next/navigation";
import { type PropsWithChildren, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Header } from "./header";

interface Dash5Props {
  defaultLayout?: number[] | undefined;
  defaultAsideCollapsed?: boolean;
  navCollapsedSize?: number;
}
export default function AgentLayoutDash({
  defaultLayout = [265, 440, 655],
  defaultAsideCollapsed = false,
  navCollapsedSize,
  children,
}: PropsWithChildren<Dash5Props>) {
  const segments = useSelectedLayoutSegments();

  const [currentSizes, setCurrentSize] = useState(defaultLayout);
  const [isCollapsed, setIsCollapsed] = useState(defaultAsideCollapsed);

  const navPanelRef = useRef<ImperativePanelHandle>(null);
  return (
    // <SlntTreeNode treeData={dashConfig.dashMenuTreeData}>
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
      }}
      className="h-full  items-stretch"
    >
      <ResizablePanel
        ref={navPanelRef}
        defaultSize={currentSizes[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={() => {
          setIsCollapsed(true);
        }}
        onExpand={() => {
          setIsCollapsed(false);
        }}
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
          "hidden sm:flex sm:flex-col",
        )}
      >
        <div
          className={cn(
            "flex h-[52px] items-center justify-center",
            isCollapsed ? "h-[52px]" : "px-2",
          )}
        >
          {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
        </div>
        {/* <Dash5Debug /> */}
        <Separator />
        <SiderNavItem
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Inbox",
              label: "128",
              icon: Inbox,
              variant: "default",
              href: "#",
            },
            {
              title: "Drafts",
              label: "9",
              icon: File,
              variant: "ghost",
              href: "#",
            },
          ]}
        />
        <Separator />
        {/* <Nav
          isCollapsed={isCollapsed}
          links={childrenDashRouters?.children?.map((x) => {
            return {
              title: x.label || "no-title",
              label: x.label || "no-label",
              icon: Users2,
              variant: "ghost",
              href: `/dash/${x.routeName}`,
            };
          })}
        /> */}
      </ResizablePanel>

      <ResizableHandle withHandle className="hidden md:flex" />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <div className="bg-muted/40 flex min-h-screen w-full flex-col">
          {/* <Dash5Aside /> */}
          <div
            className={cn(
              "flex min-h-dvh flex-col",
              // "sm:pl-14",
            )}
          >
            <Header />
            <div className="flex p-1">
              <main
                className={cn(
                  "flex h-full min-h-full flex-1",
                  //原模板样式技术上，增加的样式
                  "flex-col px-1",
                )}
              >
                {children}
                {/* <div className="min-h-full w-full flex-1 bg-yellow-200 p-2">full height</div> */}
              </main>
            </div>
            <div className="bg-slate-50" />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
    // </SlntTreeNode>
  );
}
