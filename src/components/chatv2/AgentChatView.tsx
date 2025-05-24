"use client";
import { useMtmai } from "@mtmaiui/stores/MtmaiProvider";
import { useQuery } from "@tanstack/react-query";
import type { AdkEventProperties, Part } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useScrollToBottom } from "mtxuilib/hooks/use-scroll-to-bottom";
import { formatTime } from "mtxuilib/lib/utils";
import { adkEvents } from "../../db/schema";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { ChatAvatar } from "../cloudflare-agents/components/avatar/ChatAvatar";
import { Card } from "../cloudflare-agents/components/card/Card";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { AdkWelcomeCard } from "./ChatWelcome";
import InstagramLoginView from "./func_view/InstagramLogin";

interface AgentChatViewProps {
  sessionId: string;
}
export default function AgentChatView({ sessionId }: AgentChatViewProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const serverUrl = useMtmai((x) => x.serverUrl);

  const eventQuery = useQuery({
    queryKey: ["adkEvents"],
    queryFn: () => {
      return fetch(`${serverUrl}/api/adk/events/list?session_id=${sessionId}`).then((res) =>
        res.json(),
      );
    },
  });

  return (
    <div className="h-[100vh] w-full p-4 flex justify-center items-center bg-fixed overflow-hidden">
      <div className="h-[calc(100vh-1rem)] w-full mx-auto max-w-lg flex flex-col shadow-xl rounded-md overflow-hidden relative border border-neutral-300 dark:border-neutral-800">
        <ChatHeader />
        <DebugValue data={eventQuery.data} />
        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 max-h-[calc(100vh-10rem)]"
        >
          {adkEvents && adkEvents.length <= 0 && <AdkWelcomeCard />}
          {adkEvents?.rows?.map((m) => {
            return <AdkEventsViewItemView key={m.id} item={m} />;
          })}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

export const AdkEventsViewItemView = ({
  item,
}: {
  item: AdkEventProperties;
}) => {
  const isDebug = useWorkbenchStore((x) => x.isDebug);
  const isUser = item.author === "user";
  // const showAvatar = index === 0 || agentMessages[index - 1]?.role !== m.role;
  const showAvatar = true;
  // const showRole = showAvatar && !isUser;
  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {isDebug && <DebugValue data={item} />}
          {showAvatar && !isUser ? (
            <ChatAvatar username={"AI"} />
          ) : (
            !isUser && <div className="w-8" />
          )}
          <div>
            {item.content?.parts?.map((part, i) => {
              return (
                <div key={i}>
                  {part.text && <TextContentView part={part} isUser={isUser} />}
                  {part.function_call && <FunctionCallPartView part={part} />}

                  {/* 时间字段待修正 */}
                  {item.timestamp && (
                    <p
                      className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"}`}
                    >
                      {formatTime(new Date(item.timestamp as unknown as string))}
                    </p>
                  )}
                </div>
              );

              // if (part.type === "tool-invocation") {
              //   const toolInvocation = part.toolInvocation;
              //   const toolCallId = toolInvocation.toolCallId;

              //   if (
              //     toolsRequiringConfirmation.includes(
              //       toolInvocation.toolName as keyof typeof tools,
              //     ) &&
              //     toolInvocation.state === "call"
              //   ) {
              //     return (
              //       <Card
              //         key={i}
              //         className="p-4 my-3 rounded-md bg-neutral-100 dark:bg-neutral-900"
              //       >
              //         <div className="flex items-center gap-2 mb-3">
              //           <div className="bg-[#F48120]/10 p-1.5 rounded-full">
              //             <Robot size={16} className="text-[#F48120]" />
              //           </div>
              //           <h4 className="font-medium">{toolInvocation.toolName}</h4>
              //         </div>

              //         <div className="mb-3">
              //           <h5 className="text-xs font-medium mb-1 text-muted-foreground">
              //             Arguments:
              //           </h5>
              //           <pre className="bg-background/80 p-2 rounded-md text-xs overflow-auto">
              //             {JSON.stringify(toolInvocation.args, null, 2)}
              //           </pre>
              //         </div>

              //         <div className="flex gap-2 justify-end">
              //           <Button
              //             // variant="primary"
              //             size="sm"
              //             // onClick={() =>
              //             //   addToolResult({
              //             //     toolCallId,
              //             //     result: Approval.NO,
              //             //   })
              //             // }
              //           >
              //             Reject
              //           </Button>
              //           <BetterTooltip content={"Accept action"}>
              //             <Button
              //               // variant="primary"
              //               size="sm"
              //               // onClick={() =>
              //               //   addToolResult({
              //               //     toolCallId,
              //               //     result: Approval.YES,
              //               //   })
              //               // }
              //             >
              //               Approve
              //             </Button>
              //           </BetterTooltip>
              //         </div>
              //       </Card>
              //     );
              //   }
              //   return null;
              // }
              // return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const TextContentView = ({
  part,
  isUser,
}: {
  part: Part;
  isUser: boolean;
}) => {
  return (
    <>
      <Card
        className={`p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 ${
          isUser ? "rounded-br-none" : "rounded-bl-none border-assistant-border"
        } ${part.text?.startsWith("scheduled message") ? "border-accent/50" : ""} relative`}
      >
        {part.text?.startsWith("scheduled message") && (
          <span className="absolute -top-3 -left-2 text-base">🕒</span>
        )}
        <p className="text-sm whitespace-pre-wrap">
          {part.text?.replace(/^scheduled message: /, "")}
        </p>
      </Card>
    </>
  );
};
const FunctionCallPartView = ({
  part,
}: {
  part: Part;
}) => {
  const isDebug = useWorkbenchStore((x) => x.isDebug);
  return (
    <Card className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-900">
      {isDebug && <DebugValue data={part} />}
      {/* @ts-expect-error */}
      {(part.functionCall || part.function_call)?.name === "instagram_login" ? (
        <InstagramLoginView part={part} />
      ) : (
        <></>
      )}
    </Card>
  );
};
