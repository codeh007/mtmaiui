"use client";

import type { Message } from "ai";

import { useCallback, useMemo, useState } from "react";
import { StreamingMessageParser } from "../lib/runtime/message-parser";

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{
    [key: number]: string;
  }>({});

  // const showWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);
  const setShowWorkbench = useWorkbrenchStore((x) => x.setShowWorkbench);
  const messageParser = useMemo(() => {
    return new StreamingMessageParser({
      callbacks: {
        onArtifactOpen: (data) => {
          console.log("onArtifactOpen", data);

          setShowWorkbench(true);
          workbenchStore.addArtifact(data);
        },
        onArtifactClose: (data) => {
          console.log("onArtifactClose", data);

          workbenchStore.updateArtifact(data, { closed: true });
        },
        onActionOpen: (data) => {
          console.log("onActionOpen", data.action);

          // we only add shell actions when when the close tag got parsed because only then we have the content
          if (data.action.type !== "shell") {
            workbenchStore.addAction(data);
          }
        },
        onActionClose: (data) => {
          console.log("onActionClose", data.action);

          if (data.action.type === "shell") {
            workbenchStore.addAction(data);
          }

          workbenchStore.runAction(data);
        },
      },
    });
  }, [setShowWorkbench]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const parseMessages = useCallback(
    (messages: Message[], isLoading: boolean) => {
      const reset = false;
      for (const [index, message] of messages.entries()) {
        if (message.role === "assistant") {
          const newParsedContent = messageParser.parse(
            message.id,
            message.content,
          );
          setParsedMessages((prevParsed) => ({
            ...prevParsed,
            [index]: !reset
              ? (prevParsed[index] || "") + newParsedContent
              : newParsedContent,
          }));
        }
      }
    },
    [setShowWorkbench],
  );

  return { parsedMessages, parseMessages };
}
