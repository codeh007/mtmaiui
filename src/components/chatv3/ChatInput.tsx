"use client";

import { PaperPlaneRight } from "@phosphor-icons/react";

import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { Input } from "../cloudflare-agents/components/input/Input";

export const ChatInput = () => {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const input = useWorkbenchStore((x) => x.input);
  const setInput = useWorkbenchStore((x) => x.setInput);

  return (
    <form className="p-3 bg-input-background absolute bottom-0 left-0 right-0 z-10 border-t border-neutral-300 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            // disabled={pendingToolCallConfirmation}
            // placeholder={
            //   pendingToolCallConfirmation
            //     ? "Please respond to the tool confirmation above..."
            //     : "Type your message..."
            // }
            className="pl-4 pr-10 py-2 w-full rounded-full bg-ob-btn-secondary-bg text-ob-base-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // onChange={handleAgentInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                // handleAgentSubmit(e as unknown as React.FormEvent);
                handleHumanInput({
                  role: "user",
                  parts: [
                    {
                      text: input,
                    },
                  ],
                });
              }
            }}
            onValueChange={undefined}
          />
        </div>

        <Button
          type="submit"
          // shape="square"
          className="rounded-full h-10 w-10 flex-shrink-0"
          // disabled={pendingToolCallConfirmation || !agentInput.trim()}
        >
          <PaperPlaneRight size={16} />
        </Button>
      </div>
    </form>
  );
};
