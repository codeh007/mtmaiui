"use client";

import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "mtxuilib/ui/sidebar";

import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { type Site, siteListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Icons } from "mtxuilib/icons/icons";
import { Label } from "mtxuilib/ui/label";
import { useMemo } from "react";
import { useMtmai } from "../../stores/MtmaiProvider";
export function SiteSidebar() {
  const isDebug = useMtmai((x) => x.isDebug);

  const linkToNew = useMemo(() => {
    return "/site/new";
  }, []);

  const tid = useTenantId();
  const sitesQuery = useQuery({
    ...siteListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">站点</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={linkToNew}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <Icons.plus className="size-4" />
            </CustomLink>
            {/* <Switch className="shadow-none" /> */}
          </Label>
        </div>
        {/* <SidebarInput
          placeholder="Type to search..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => { }}
        /> */}
        {/* <AdkAppSelect /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {isDebug && <DebugValue data={{ data: sitesQuery.data }} />}
            {sitesQuery.data?.rows?.map((item) => (
              <SiteSidebarItem key={item.id} site={item} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
interface SiteListItemProps {
  site: Site;
}
const SiteSidebarItem = ({ site }: SiteListItemProps) => {
  const isDebug = useMtmai((x) => x.isDebug);
  return (
    <div className="flex  p-2 ">
      <div className="flex-1">
        <CustomLink to={`/site/${site.id}`}>{site.title}</CustomLink>
      </div>
      <div className="flex-0">
        <DebugValue data={site} enable={isDebug} />
      </div>
    </div>
  );
};
