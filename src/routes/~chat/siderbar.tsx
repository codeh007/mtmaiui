"use client";

import type { AdkSession } from "mtmaiapi";
import { cn, generateUUID } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "mtxuilib/ui/sidebar";

import { Icons } from "mtxuilib/icons/icons";
import { Label } from "mtxuilib/ui/label";
import { useMemo } from "react";
import { AdkAppSelect } from "../../components/chatv2/app_select";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function NavChat() {
  const isDebug = useWorkbenchStore((x) => x.isDebug);

  const linkToNew = useMemo(() => {
    const uuid = generateUUID();
    return `/chat/${uuid}`;
  }, []);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">对话</div>
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
        <AdkAppSelect />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {/* {isDebug && <DebugValue data={{ data: chatSessionQuery.data }} />}
            {chatSessionQuery.data?.rows?.map((item) => (
              <NavAdkSessionItem key={item.id} item={item} rowId={item.id} />
            ))} */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const NavAdkSessionItem = ({ item, rowId }: { item: AdkSession; rowId: string }) => {
  return (
    <div className="bg-slate-100 border px-2 mb-2 rounded-md flex flex-col">
      <div className="flex items-center justify-between">
        {/* <DebugValue data={{ data: item }} /> */}
        <CustomLink to={`/adk/session/${item.id}`}>
          <div>{item.app_name || item.id}</div>
          <div>{item.title}</div>
        </CustomLink>
        <div>{item.app_name}</div>
      </div>
    </div>
  );
};
