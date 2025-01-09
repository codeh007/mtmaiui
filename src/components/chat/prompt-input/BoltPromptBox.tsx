"use client";

import classNames from "classnames";
import { cn } from "mtxuilib/lib/utils";
import { SendButton } from "./SendButton.client";

const TEXTAREA_MIN_HEIGHT = 76;

interface BoltPromptBoxProps {
  chatStarted: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  sendMessage?: (messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isStreaming?: boolean;
  input?: string;
  stop?: () => void;
  promptEnhanced?: boolean;
  enhancingPrompt?: boolean;
  enhancePrompt?: () => void;
}
export const BoltPromptBox = ({
  chatStarted,
  textareaRef,
  sendMessage,
  handleInputChange,
  isStreaming,
  input,
  enhancingPrompt,
  promptEnhanced,
  enhancePrompt,
  stop,
}: BoltPromptBoxProps) => {
  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

  return (
    <>
      <div
        className={cn("relative w-full max-w-chat mx-auto z-prompt", {
          "sticky bottom-6": chatStarted,
        })}
      >
        <div
          className={cn(
            "shadow-sm border border-bolt-elements-borderColor bg-bolt-elements-prompt-background backdrop-filter backdrop-blur-[8px] rounded-lg overflow-hidden",
            "mx-4",
          )}
        >
          <textarea
            ref={textareaRef}
            className={
              "w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent"
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (event.shiftKey) {
                  return;
                }

                event.preventDefault();

                sendMessage?.(event.currentTarget.value);
              }
            }}
            value={input}
            onChange={(event) => {
              handleInputChange?.(event);
            }}
            style={{
              minHeight: TEXTAREA_MIN_HEIGHT,
              maxHeight: TEXTAREA_MAX_HEIGHT,
            }}
            placeholder="今天能为您做些什么？"
            translate="no"
          />

          <SendButton
            show={input?.length > 0 || isStreaming}
            isStreaming={isStreaming}
            onClick={(event) => {
              if (isStreaming) {
                stop?.();
                return;
              }

              sendMessage?.(event.currentTarget.value);
            }}
          />

          <div className="flex justify-between text-sm p-4 pt-2">
            <div className="flex gap-1 items-center">
              <IconButton
                title="Enhance prompt"
                disabled={input?.length === 0 || enhancingPrompt}
                className={classNames({
                  "opacity-100!": enhancingPrompt,
                  "text-bolt-elements-item-contentAccent! pr-1.5 enabled:hover:bg-bolt-elements-item-backgroundAccent!":
                    promptEnhanced,
                })}
                onClick={() => enhancePrompt?.()}
              >
                {enhancingPrompt ? (
                  <>
                    <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl" />
                    <div className="ml-1.5">Enhancing prompt...</div>
                  </>
                ) : (
                  <>
                    <div className="i-bolt:stars text-xl" />
                    {promptEnhanced && (
                      <div className="ml-1.5">Prompt enhanced</div>
                    )}
                  </>
                )}
              </IconButton>
            </div>
            {input?.length > 3 ? (
              <div className="text-xs text-bolt-elements-textTertiary">
                Use <kbd className="kdb">Shift</kbd> +{" "}
                <kbd className="kdb">Return</kbd> for a new line
              </div>
            ) : null}
          </div>
        </div>
        <div className="bg-bolt-elements-background-depth-1 pb-6">
          {/* Ghost Element */}
        </div>
      </div>
    </>
  );
};
