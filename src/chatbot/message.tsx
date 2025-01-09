"use client";

import type { Message, ToolInvocation } from "ai";
import { IconOpenAI, IconUser } from "mtxuilib/icons/icons-ai";
import { cn } from "mtxuilib/lib/utils";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { DebugValue } from "../components/devtools/DebugValue";
import { CodeBlock } from "./codeblock";
import { MemoizedReactMarkdown } from "./markdown";
import { spinner } from "./spinner";

export function UserMessage(props: { message: Message }) {
  const { message } = props;
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {message.content}
      </div>
    </div>
  );
}

export function BotMessage({
  message,
  className,
}: {
  message: Message;
  className?: string;
}) {
  return (
    <div>
      <div
        className={cn("group relative flex items-start md:-ml-12", className)}
      >
        <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
          <IconOpenAI />
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 prose">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                //普通段落
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code(props) {
                // 代码块
                const match = /language-(\w+)/.exec(className || "");
                return (
                  <CodeBlock
                    key={Math.random()}
                    language={match?.[1] || ""}
                    value={String(props.children).replace(/\n$/, "")}
                    {...props}
                  />
                );
              },
            }}
          >
            {message.content}
          </MemoizedReactMarkdown>

          {message.toolInvocations?.map((item, i) => (
            <ToolResultItem key={item.toolCallId} toolInvocation={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ToolResultItem = (props: { toolInvocation: ToolInvocation }) => {
  const { toolInvocation } = props;
  switch (toolInvocation.toolName) {
    case "hello_tool":
      return (
        <div className="bg-red-100 p-2">
          hello_tool
          {JSON.stringify(toolInvocation)}
        </div>
      );
    case "setState":
      break;
    default:
      return (
        <div>
          <DebugValue
            title={`tool result: ${toolInvocation.toolName}`}
            data={{ toolInvocation }}
          />
        </div>
      );
  }
};

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible",
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}

export const MessageItem = (props: { m: Message }) => {
  const { m } = props;
  return (
    <div key={m.id} className="whitespace-pre-wrap">
      {m.role === "user" && <UserMessage message={m} />}
      {m.role !== "user" && <BotMessage message={m} />}
    </div>
  );
};
