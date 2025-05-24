"use client";

import { Button } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "mtxuilib/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import type { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "./icons";
import { SidebarHistory } from "./sidebar-history";
import { SidebarUserNav } from "./sidebar-user-nav";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <Tabs defaultValue="chats">
        <TabsList>
          <TabsTrigger value="tasks" variant="underlined">
            任务
          </TabsTrigger>
          <TabsTrigger value="chats" variant="underlined">
            历史
          </TabsTrigger>
          <TabsTrigger value="agent" variant="underlined">
            状态
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">tasks</TabsContent>
        <TabsContent value="chats">
          <SidebarHeader>
            <SidebarMenu>
              <div className="flex flex-row justify-between items-center">
                <Link
                  href="/"
                  onClick={() => {
                    setOpenMobile(false);
                  }}
                  className="flex flex-row gap-3 items-center"
                >
                  <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                    Chatbot
                  </span>
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      type="button"
                      className="p-2 h-fit"
                      onClick={() => {
                        setOpenMobile(false);
                        router.push("/");
                        router.refresh();
                      }}
                    >
                      <PlusIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="end">New Chat</TooltipContent>
                </Tooltip>
              </div>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarHistory user={user} />
          </SidebarContent>
          <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
        </TabsContent>
        <TabsContent value="agent">agent</TabsContent>
      </Tabs>
    </Sidebar>
  );
}
