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
  SidebarInput,
} from "mtxuilib/ui/sidebar";

import { useMtmai } from "@mtmaiui/stores/MtmaiProvider";
import { useQuery } from "@tanstack/react-query";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Icons } from "mtxuilib/icons/icons";
import { Label } from "mtxuilib/ui/label";
import { Switch } from "mtxuilib/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { type ChangeEvent, useMemo } from "react";
import { useWorkbenchStore } from "../../stores/workbrench.store";
export function NavSession() {
  const linkToNew = useMemo(() => {
    return "new";
  }, []);

  return (
    <>
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <Tabs defaultValue="tasks">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <TabsList layout="underlined">
              <TabsTrigger variant="underlined" value="tasks">
                任务
              </TabsTrigger>
              <TabsTrigger variant="underlined" value="chats">
                历史
              </TabsTrigger>
              <TabsTrigger variant="underlined" value="agent">
                状态
              </TabsTrigger>
            </TabsList>
          </SidebarHeader>
          <TabsContent value="tasks">
            <TaskSessionList />
          </TabsContent>
          <TabsContent value="chats">
            <div className="flex w-full items-center justify-between">
              {/* <div className="text-base font-medium text-foreground">对话</div> */}
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
            <SidebarInput
              placeholder="Type to search..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // console.log("sidebar input", e.target.value);
                // setQueryParams({
                //   label: e.target.value,
                // });
              }}
            />
            <SidebarContent>
              <SidebarGroup className="px-0">
                <SidebarGroupContent>
                  <ChatSessionList />
                </SidebarGroupContent>
                {/* <SidebarGroupContent></SidebarGroupContent> */}
              </SidebarGroup>
            </SidebarContent>
          </TabsContent>
          <TabsContent value="agent">
            <AgentStateView />
          </TabsContent>
        </Tabs>
      </Sidebar>
    </>
  );
}

const ChatSessionList = () => {
  const mtmServerUrl = useMtmai((x) => x.serverUrl);
  const { data: sessions } = useQuery({
    queryKey: ["agents/sessions"],
    queryFn: () => {
      return fetch(`${mtmServerUrl}/api/agents/sessions/list`).then((res) => res.json());
    },
  });
  return (
    <div>
      <DebugValue data={sessions} />
      {sessions?.data?.map((session: any) => (
        <ChatSessionItem key={session.id} session={session} />
      ))}
    </div>
  );
};

const ChatSessionItem = ({ session }: { session: any }) => {
  return (
    <div className="flex items-center justify-between bg-muted p-2">
      <div>
        <CustomLink to={`/agents/${session.name}/${session.id}`}>{session.name}</CustomLink>
      </div>
    </div>
  );
};

const TaskSessionList = () => {
  const taskList = useWorkbenchStore((x) => x.taskList);
  const isDebug = useWorkbenchStore((x) => x.isDebug);
  return (
    <div>
      {taskList.map((task) => (
        <div key={task.id} className="flex items-center justify-between bg-muted p-2">
          {isDebug && <DebugValue data={task} />}
          <div>{task.id}</div>
          <div className="text-sm text-muted-foreground">{task.created_at}</div>
        </div>
      ))}
    </div>
  );
};

const AgentStateView = () => {
  const assistantState = useWorkbenchStore((x) => x.assistantState);
  return (
    <div>
      <DebugValue data={assistantState} />
    </div>
  );
};
