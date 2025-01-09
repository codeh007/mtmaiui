"use client";

import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { Suspense, useState } from "react";
import { ChatMessageList } from "./ChatList";
import { useSubmitUserInputText } from "./hooks";
import { PromptForm } from "./prompt-form";
import { AgentTaskFormOpener } from "./task_form/AgentTaskForm";

interface ChatBotUIProps {
  setOpen: (open: boolean) => void;
  open: boolean;
}
/**
 * 聊天组件
 * @returns
 */
export const ChatBotUI = (props: ChatBotUIProps) => {
  const { setOpen, open } = props;
  const [input, setInput] = useState("");
  const handlerUserSutmitText = useSubmitUserInputText();

  return (
    <div
      className={cn(
        "fixed right-0 top-14 bottom-0 w-80 bg-white shadow-lg p-1 flex flex-col border-l border-gray-300",
        open ? "" : "hidden",
      )}
    >
      <div className="text-xl font-bold mb-4">
        {/* 侧标聊天机器人的头部工具栏（包括常见操作按钮，下拉菜单等） */}
        <div className="flex justify-between items-center">
          <AgentTaskFormOpener taskName="post_generate" />
          <Button variant="ghost" onClick={() => setOpen(false)}>
            <Icons.X className="h-4 w-4" />
          </Button>
          <Button>
            <Icons.apple className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4">
        {/* 聊天消息列表 */}
        <Suspense>
          <ChatMessageList variant="sidebar" />
        </Suspense>
      </div>

      <div className="flex">
        {/* 输入框 */}
        <PromptForm
          input={input}
          setInput={setInput}
          onSubmit={(value) => handlerUserSutmitText(value)}
        />
      </div>
    </div>
  );
};
