"use client";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { Label } from "mtxuilib/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  useSidebar,
} from "mtxuilib/ui/sidebar";
import { Switch } from "mtxuilib/ui/switch";
import { ProxyListView } from "./ProxyListView";

export function NavProxy() {
  const { isMobile } = useSidebar();
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">网络代理</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={"/proxy/new"}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <span>New</span>
            </CustomLink>
            <Switch />
          </Label>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <ProxyListView />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
