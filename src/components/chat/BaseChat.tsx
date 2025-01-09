"use client";
import type { Message } from "ai";
import type React from "react";
import { type RefCallback, forwardRef, useMemo } from "react";

import { classNames } from "mtxuilib/lib/utils";
import { BoltPromptBox } from "./prompt-input/BoltPromptBox";

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
}

export const BaseChat = forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      input = "",
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    const messages = useWorkbrenchStore((x) => x.messages);
    const chatStarted = useMemo(() => {
      return messages?.length > 0;
    }, [messages]);

    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    return (
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
            {/* <DebugValue title="elements" data={elements} /> */}
            {/* {!chatStarted && assistantConfig?.welcome && (
              <ChatWelcome welcome={assistantConfig.welcome} />
            )} */}
            <div
              className={classNames("pt-2 px-1", {
                "h-full flex flex-col": chatStarted,
              })}
            >
              {chatStarted ? (
                <>
                  {/* <Messages
										ref={messageRef}
										className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1"
										messages={messages}
										isStreaming={isStreaming}
									/> */}
                  {/* <MtMessages
                    ref={messageRef}
                    messages={messages}
                    elements={elements || []}
                    actions={[]}
                    indent={0}
                    isStreaming={isStreaming}
                    className="flex flex-col w-full flex-1 max-w-chat pb-3 mx-auto z-1 mb-6"
                  /> */}
                </>
              ) : null}

              <BoltPromptBox
                enhancingPrompt={enhancingPrompt}
                promptEnhanced={promptEnhanced}
                input={input}
                sendMessage={sendMessage}
                isStreaming={isStreaming}
                chatStarted={chatStarted}
                handleInputChange={handleInputChange}
                // handleStop={handleStop}
                textareaRef={textareaRef}
              />
            </div>
            {/* {!chatStarted && <ChatStarts onSelect={handleSelectStart} />} */}
          </div>

          {/* <MtWorkbench chatStarted={chatStarted} isStreaming={isStreaming} /> */}
        </div>
      </div>
    );
  },
);
