"use client";


import * as React from "react";
import Textarea from "react-textarea-autosize";
import { useAgentName } from "./hooks";
import { IconPlus, IconArrowElbow } from "mtxuilib/icons/icons-ai";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "mtxuilib/ui/tooltip";

export function PromptForm({
  input,
  setInput,
  onSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const agent = useAgentName();
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();
        // Blur focus on mobile
        if (window.innerWidth < 600) {
          // e.target.message?.blur();
        }
        const value = input.trim();
        setInput("");
        if (!value) return;
        onSubmit?.(value);
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                // router.push(`/agent/${agent}`);
              }}
            >
              <IconPlus />
              <span className="sr-only">新对话</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>新对话</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ""}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
