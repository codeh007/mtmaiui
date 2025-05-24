"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import type {
  AdkEvent,
  ChatMessage,
  Content,
  FunctionCall,
  LlmMessage,
  Part,
  // adkEventsListOptions,
} from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { SparklesIcon } from "mtxuilib/icons/aichatbot.icons";
import { Markdown } from "mtxuilib/markdown/Markdown";

import { camelCase } from "lodash-es";
import { cn } from "mtxuilib/lib/utils";
import { useTenantId } from "../../hooks/useAuth";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { AskUserMessage } from "./tool-messages/AskUserMessage";
import { CodeExecutorView } from "./tool-messages/CodeExecutor";
// import { SocialLoginView } from "./tool-messages/SocialLogin";
import { FunctionExecutionResultMessageView } from "./tool-messages/ToolMessageView";

interface MtMessagesProps {
  messages: ChatMessage[];
}
export const ModelContextMessageView = ({ messages }: MtMessagesProps) => {
  const tid = useTenantId();
  const session = useWorkbenchStore((x) => x.sessionId);
  // const adkEventsQuery = useQuery({
  //   ...adkEventsListOptions({
  //     path: {
  //       tenant: tid,
  //     },
  //     query: {
  //       limit: 100,
  //       session: session,
  //     },
  //   }),
  // });
  return (
    <div className="p-1 px-2">
      <DebugValue data={{ messages }} />
      {messages?.map((message, i) => (
        <MtSuspenseBoundary key={i}>
          <ChatMessageItemView message={message} />
        </MtSuspenseBoundary>
      ))}

      <div className="mt-4 space-y-2">
        {/* {adkEventsQuery.data?.rows?.map((event) => (
          <AdkEventMessageView key={event.id} event={event} />
        ))} */}
      </div>
    </div>
  );
};

export const ChatMessageItemView = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="bg-slate-100 p-1">
      <MtSuspenseBoundary>
        {message.type === "UserMessage" ? (
          <UserMessageView msg={message} />
        ) : message.type === "AssistantMessage" ? (
          <AssistantMessageView msg={message} />
        ) : message.llm_message.type === "FunctionExecutionResultMessage" ? (
          <FunctionExecutionResultMessageView msg={message.llm_message} />
        ) : (
          <div className="text-sm text-slate-500">unknown message type: {message.type}</div>
        )}
      </MtSuspenseBoundary>
    </div>
  );
};

export interface UserMessageProps {
  msg: ChatMessage;
}
export const UserMessageView = ({ msg }: UserMessageProps) => {
  return (
    <div className="relative flex w-full max-w-2xl gap-3 pb-1">
      <Avatar>
        <AvatarFallback>Y</AvatarFallback>
      </Avatar>

      <div className="flex-grow">
        <p className="font-semibold">You</p>
        <div className="whitespace-pre-line text-foreground">
          <Markdown>{msg.content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export const AssistantMessageView = ({ msg }: { msg: ChatMessage }) => {
  return (
    <div className="p-1">
      <DebugValue data={{ msg }} />
      <div className="text-sm text-slate-500">
        {msg.type}/{msg.source}/{msg.type}
      </div>

      <AssistantLlmMessageView msg={msg.llm_message} />
    </div>
  );
};

export const AssistantLlmMessageView = ({ msg }: { msg: LlmMessage }) => {
  return (
    <div className="p-1 rounded-md">
      {typeof msg.content === "string" ? (
        <div className="max-w-[760px] overflow-x-auto">
          <Markdown>{msg.content}</Markdown>
        </div>
      ) : (
        <FunctionCallView msg={msg.content as FunctionCall[]} />
      )}
    </div>
  );
};

export const FunctionCallView = ({ msg }: { msg: FunctionCall[] }) => {
  return (
    <div className="p-1 space-y-2">
      {msg?.map((item) => (
        <FunctionCallItemView key={item.id} msg={item} />
      ))}
    </div>
  );
};

export const FunctionCallItemView = ({ msg }: { msg: FunctionCall }) => {
  const toolName = camelCase(msg.name);
  return (
    <div className="p-1 border">
      {toolName === "codeExecutor" ? (
        <CodeExecutorView msg={msg} />
      ) : toolName === "socialLogin" ? (
        <SocialLoginView msg={msg} />
      ) : toolName === "askUser" ? (
        <AskUserMessage msg={msg} />
      ) : (
        <div className="text-sm text-red-500">error: unknown function call: {msg.name}</div>
      )}
    </div>
  );
};

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">Thinking...</div>
        </div>
      </div>
    </motion.div>
  );
};

export const AdkEventMessageView = ({ event }: { event: AdkEvent }) => {
  return (
    <div className="relative p-1">
      <div className="text-sm text-slate-500">
        <AdkContentView content={event.content} />
      </div>
      <div className="absolute top-0 right-0">
        <DebugValue data={{ event }} />
      </div>
    </div>
  );
};

export const AdkContentView = ({ content }: { content: Content }) => {
  return (
    <div>
      {content.role === "user" ? (
        <div className="rounded-md p-2 bg-muted">
          {content.parts.map((part, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <AdkContentPartView key={i} part={part} />
          ))}
        </div>
      ) : content.role === "model" ? (
        <div className="rounded-md p-2 bg-blue-100">
          {content.parts.map((part, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <AdkContentPartView key={i} part={part} />
          ))}
        </div>
      ) : (
        <div>unknown content role: {content.role}</div>
      )}
    </div>
  );
};

export const AdkContentPartView = ({ part }: { part: Part }) => {
  return <Markdown>{part.text || ""}</Markdown>;
};
