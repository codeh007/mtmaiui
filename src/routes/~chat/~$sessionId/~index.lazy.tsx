import { DEFAULT_CHAT_MODEL } from "@mtmaiui/agent_utils/models";
import { Chat } from "@mtmaiui/aichatbot/chat";
import { DataStreamHandler } from "@mtmaiui/aichatbot/data-stream-handler";
import type { DBChatMessage } from "@mtmaiui/db/schema";
import { convertToUIMessages } from "@mtmaiui/lib/aisdk_utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { useMemo } from "react";

export const Route = createLazyFileRoute("/chat/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  //TODO: 从数据库中获取初始消息

  const chatMessageQuery = useSuspenseQuery({
    queryKey: ["chatMessage", sessionId],
    queryFn: async () => {
      const resp = await fetch(`/api/chat/messages/list?chatId=${sessionId}`);
      return resp.json() as any;
    },
  });
  const initMessages = useMemo(() => {
    if (chatMessageQuery.data?.rows) {
      return convertToUIMessages(chatMessageQuery.data?.rows as DBChatMessage[]);
    }
    return [];
  }, [chatMessageQuery.data]);
  return (
    <>
      <MtSuspenseBoundary>{/* <AppSidebar /> */}</MtSuspenseBoundary>
      <MtSuspenseBoundary>
        <SidebarInset>
          <DebugValue data={initMessages} />
          <MtSuspenseBoundary>
            <Chat
              key={sessionId}
              id={sessionId}
              initialMessages={initMessages}
              initialChatModel={DEFAULT_CHAT_MODEL}
              initialVisibilityType="private"
              isReadonly={false}
              // session={session}
              autoResume={false}
              api="/api/chat/sse"
            />
          </MtSuspenseBoundary>
          <DataStreamHandler id={sessionId} />
        </SidebarInset>
      </MtSuspenseBoundary>
    </>
  );
}
