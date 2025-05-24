"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Switch } from "mtxuilib/ui/switch";

// import { platformAccountListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  useSidebar,
} from "mtxuilib/ui/sidebar";

import { Icons } from "mtxuilib/icons/icons";
import { useTenantId } from "../../hooks/useAuth";

export function NavPlatformAccount() {
  const { isMobile } = useSidebar();
  const tid = useTenantId();
  // const platformAccountQuery = useQuery({
  //   ...platformAccountListOptions({
  //     path: {
  //       tenant: tid!,
  //     },
  //   }),
  // });

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">账号</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={"new"}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <Icons.plus className="size-4" />
            </CustomLink>
            <Switch className="shadow-none" />
          </Label>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-1">
          <SidebarGroupContent className="px-1 space-y-1 border-b">
            {platformAccountQuery.data?.rows?.map((item) => (
              <div
                key={item.metadata?.id}
                className="flex flex-col flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CustomLink to={`${item.metadata?.id}`} key={item.metadata?.id} className="">
                  <span className="line-clamp-2 whitespace-break-spaces text-xs">
                    {item.username || item.metadata?.id}
                  </span>
                </CustomLink>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
