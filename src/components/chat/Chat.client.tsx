"use client";
import type { Message } from "ai";
import { useAnimate } from "framer-motion";
import { useSnapScroll } from "mtxuilib/hooks/useSnapScroll";
import { cn } from "mtxuilib/lib/utils";
import {
  type RefCallback,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useWorkbenchStore } from "../../stores/workbrench.store";

import { classNames } from "mtxuilib/lib/utils";
import { ModelContextMessageView } from "./ModelContextMessageView";
import { BoltPromptBox } from "./prompt-input/BoltPromptBox";

// const toastAnimation = cssTransition({
//   enter: "animated fadeInRight",
//   exit: "animated fadeOutRight",
// });

interface ChatProps {
  initialMessages?: Message[];
  storeMessageHistory?: (messages: Message[]) => Promise<void>;
}

export function ChatClient(props: ChatProps) {
  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);
  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  useEffect(() => {
    setOpenChat(true);
  }, [setOpenChat]);
  return (
    <>
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
          <ChatImpl />
        </div>
      </div>
    </>
  );
}

export const ChatImpl = memo((props: ChatProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showChat = useWorkbenchStore((x) => x.openChat);
  const [animationScope, animate] = useAnimate();
  const input = useWorkbenchStore((x) => x.input);
  const setInput = useWorkbenchStore((x) => x.setInput);
  const started = useWorkbenchStore((x) => x.chatStarted);
  const TEXTAREA_MAX_HEIGHT = started ? 400 : 200;
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const scrollTextArea = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const abort = () => {
    stop();
    // chatStore.setKey("aborted", true);
    // setAborted(true);
    // workbenchStore.abortAllActions();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
      textarea.style.overflowY =
        scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
    }
  }, [input, textareaRef]);

  const runAnimation = async () => {
    if (started) {
      return;
    }
  };

  const sendMessage = async (messageInput?: string) => {
    const _input = messageInput || input;
    if (!_input) {
      return;
    }
    handleHumanInput({
      role: "user",
      parts: [{ text: _input }],
    });
    runAnimation();
    setInput("");
    // resetEnhancer();
    textareaRef.current?.blur();
  };

  const [messageRef, scrollRef] = useSnapScroll();
  return (
    <BaseChat
      ref={animationScope}
      // textareaRef={textareaRef}
      input={input}
      showChat={!!showChat}
      isStreaming={false}
      // enhancingPrompt={enhancingPrompt}
      // promptEnhanced={promptEnhanced}
      sendMessage={sendMessage}
      messageRef={messageRef}
      scrollRef={scrollRef}
      handleStop={abort}
    />
  );
});

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  input?: string;
  handleStop?: () => void;
  sendMessage?: (messageInput?: string) => void;
  enhancePrompt?: () => void;
  workbrenchChildren?: React.ReactNode;
}

export const BaseChat = forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      isStreaming = false,
      input = "",
      sendMessage,
    },
    ref,
  ) => {
    const messages = useWorkbenchStore((x) => x.messages);
    const chatStarted = useMemo(() => {
      return messages?.length > 0;
    }, [messages]);

    const setInput = useWorkbenchStore((x) => x.setInput);
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    // const userAgentState = useWorkbenchStore((x) => x.userAgentState);
    return (
      <>
        <div
          ref={ref}
          className={classNames(
            "relative flex h-full w-full bg-bolt-elements-background-depth-1 ",
          )}
          data-chat-visible={showChat}
        >
          <div ref={scrollRef} className="flex overflow-scroll w-full h-full">
            <div
              className={classNames(
                "flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full",
              )}
            >
              <div
                className={classNames("pt-2 px-1", {
                  "h-full flex flex-col": chatStarted,
                })}
              >
                {/* <DebugValue data={{ messages, userAgentState }} />                 */}
                <ModelContextMessageView
                  ref={messageRef}
                  messages={messages}
                  elements={[]}
                  actions={[]}
                  indent={0}
                  isStreaming={isStreaming}
                  className="flex flex-col w-full flex-1 max-w-chat pb-3 mx-auto z-1 mb-6"
                />

                <BoltPromptBox
                  // enhancingPrompt={enhancingPrompt}
                  // promptEnhanced={promptEnhanced}
                  input={input}
                  sendMessage={sendMessage}
                  isStreaming={isStreaming}
                  chatStarted={chatStarted}
                  handleInputChange={(message) => setInput(message)}
                  // handleStop={handleStop}
                  textareaRef={textareaRef}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
