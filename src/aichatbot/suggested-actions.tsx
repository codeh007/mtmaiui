"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Button } from "mtxuilib/ui/button";
import { memo } from "react";
import { Route } from "../routes/~__root";
import type { VisibilityType } from "./visibility-selector";
const suggestedActions = [
  {
    title: "tiktok 短视频脚本",
    label: "短视频脚本",
    action:
      "以 勇往直前 为主题, 编写一个短视频脚本, 要求视频长度在 15 秒以内, 面向18到30岁人群. 尽量自动完成,你可以自由发挥.",
  },
  {
    title: "Write code to",
    label: `demonstrate djikstra's algorithm`,
    action: `Write code to demonstrate djikstra's algorithm`,
  },
  {
    title: "帮我写一篇关于硅谷的文章",
    label: "硅谷文章",
    action: "帮我写一篇关于硅谷的文章",
  },
  {
    title: "What is the weather",
    label: "in San Francisco?",
    action: "What is the weather in San Francisco?",
  },
  {
    title: "纯文本文档生成",
    label: "纯文本文档生成",
    action: "帮我写一篇关于硅谷的文章,文档类型是text, 标题和内容你自由发挥",
  },
];
interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers["append"];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({ chatId, append, selectedVisibilityType }: SuggestedActionsProps) {
  const nav = Route.useNavigate();
  return (
    <div data-testid="suggested-actions" className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              // window.history.replaceState({}, "", `/chat/${chatId}`);
              nav({ to: `/chat/${chatId}` });
              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">{suggestedAction.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, (prevProps, nextProps) => {
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) return false;

  return true;
});
