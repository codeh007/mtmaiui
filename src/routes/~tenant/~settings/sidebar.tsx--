"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type TenantSetting, tenantSettingsListOptions } from "mtmaiapi";
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
} from "mtxuilib/ui/sidebar";

import { Icons } from "mtxuilib/icons/icons";
import { Switch } from "mtxuilib/ui/switch";
import { useMemo } from "react";
import { useTenantId } from "../../../hooks/useAuth";

export function NavTenantSettings() {
  const tid = useTenantId();
  const tenantSettingsQuery = useSuspenseQuery({
    ...tenantSettingsListOptions({
      path: {
        tenant: tid!,
      },
    }),
  });

  const linkToNew = useMemo(() => {
    return "/tenant/settings/new";
  }, []);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">租户设置</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={linkToNew}
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
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {tenantSettingsQuery.data?.rows?.map((item) => (
              <NavTenantSettingItem
                key={item.metadata?.id}
                item={item}
                rowId={item.metadata?.id || ""}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const NavTenantSettingItem = ({
  item,
  rowId,
}: { item: TenantSetting; rowId: string }) => {
  const detailLink = useMemo(() => {
    return `${rowId}`;
  }, [rowId]);
  return (
    <>
      <CustomLink
        to={detailLink}
        key={rowId}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">
          <span>{item.metadata.id}</span>
          {/* <span className="ml-auto text-xs">{chat.createdAt}</span> */}
        </div>
        {/* <span className="font-medium">{item.label}</span> */}
        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
          {/* {item.description || rowId} */}
        </span>
      </CustomLink>
    </>
  );
};
