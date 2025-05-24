"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {} from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  useSidebar,
} from "mtxuilib/ui/sidebar";

import { Trash2Icon } from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { Switch } from "mtxuilib/ui/switch";
import { useToast } from "mtxuilib/ui/use-toast";
import { useMemo } from "react";
import { useTenantId } from "../../hooks/useAuth";

export function NavResource() {
  const { isMobile } = useSidebar();
  const tid = useTenantId();
  // const platformAccountQuery = useSuspenseQuery({
  //   ...resourceListOptions({
  //     path: {
  //       tenant: tid!,
  //     },
  //   }),
  // });

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">资源</div>
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
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {/* {platformAccountQuery.data?.rows?.map((item) => (
              <NavResourceItem key={item.metadata?.id} item={item} />
            ))} */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const NavResourceItem = ({ item }: { item: MtResource }) => {
  const linkTo = useMemo(() => {
    return `${item.metadata?.id}/${item.type || ""}`;
  }, [item.metadata?.id, item.type]);

  const tid = useTenantId();
  const toast = useToast();
  const queryClient = useQueryClient();

  const resourceDeleteMu = useMutation({
    ...resourceDeleteMutation({}),
    onSuccess: () => {
      toast.toast({
        title: "删除成功",
      });
      queryClient.invalidateQueries({
        queryKey: resourceListQueryKey({
          path: {
            tenant: tid!,
          },
        }),
      });
    },
  });
  const handleDelete = () => {
    // resourceDeleteMu.mutate({
    //   path: {
    //     tenant: tid!,
    //     resource: item.metadata?.id,
    //   },
    // });
  };
  return (
    <div className="justify-between border-b space-y-0.5 w-full rounded-md">
      <CustomLink
        to={linkTo}
        key={item.metadata?.id}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">
          <span>{item.title}</span>{" "}
          {/* <span className="ml-auto text-xs">{chat.createdAt}</span> */}
        </div>
        <span className="font-medium">{item.title}</span>
        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
          {item.title || item.metadata?.id}
        </span>
      </CustomLink>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};
