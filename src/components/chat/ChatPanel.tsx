"use client";

import { cn } from "mtxuilib/lib/utils";
import { LzChatClient } from "../LzComponents";

export const ChatPanel = () => {
  // 这里主要处理打开关闭 中间的聊天窗口的动画效果。
  // const openChat = useWorkbrenchStore((x) => x.uiState.openChat);
  const openWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);
  const openChat = true;
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out min-w-min w-full",
        {
          "h-screen": true, //保持滚动条在容器内
          "w-0": !openChat,
        },
      )}
    >
      <div
        className={cn(
          "transition-all duration-300 ease-in-out h-full  border-gray-300/50 overflow-scroll mx-auto",
          {
            "opacity-100 visible": openChat,
            "opacity-0 invisible": !openChat,
            "border-r-[1px]": openWorkbench,
            // "overflow-hidden": true,
          },
        )}
        style={
          {
            width: openChat ? "100%" : "0",
            overflow: "hidden",
            "--chat-max-width": "52rem", // 根据实际情况设置 chat 视图的最大宽度
          } as React.CSSProperties
        }
      >
        <LzChatClient />
      </div>
    </div>
  );
};
