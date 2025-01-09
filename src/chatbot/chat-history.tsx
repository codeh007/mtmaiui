"use client";

import { IconPlus } from "mtxuilib/icons/icons-ai";
import { cn } from "mtxuilib/lib/utils";
import { MtLink } from "mtxuilib/mt/mtlink";
import { buttonVariants } from "mtxuilib/ui/button";
import { Suspense } from "react";
import { useAgentName, useMakeNewChat } from "./hooks";
import { SidebarList } from "./sidebar-list";

interface ChatHistoryProps {
  userId?: string;
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  const makeNewChat = useMakeNewChat();
  const agent = useAgentName();
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">历史</h4>
      </div>
      <div className="mb-2 px-2 justify-end flex">
        <MtLink
          variant={"ghost"}
          href={`/agent?agent=${agent}`}
          onClick={() => {
            makeNewChat();
          }}
          className={cn(
            buttonVariants({ variant: "outline" }),
            // "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10",
          )}
        >
          <IconPlus className="-translate-x-2 stroke-2" />
          新建对话
        </MtLink>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <SidebarList userId={userId} />
      </Suspense>
    </div>
  );
}
