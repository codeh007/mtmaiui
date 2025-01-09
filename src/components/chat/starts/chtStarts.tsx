"use client";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { Icons } from "mtxuilib/icons/icons";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { Suspense } from "react";
import { useWorkbrenchStore } from "../../../stores/workbrench.store";

interface ChatStartsProps {
  onSelect: (item: AssisantStart) => void;
}
export const ChatStarts = ({ onSelect }: ChatStartsProps) => {
  const assistantConfig = useWorkbrenchStore((x) => x.assisantConfig);

  const starts = assistantConfig?.starts;

  return (
    <div
      id="examples"
      className="relative w-full max-w-xl mx-auto mt-8 flex justify-center flex-col"
    >
      {/* <PromptBox /> */}
      <Suspense
        fallback={
          <>
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </>
        }
      >
        <MtErrorBoundary>
          <SavedTasks />
        </MtErrorBoundary>
      </Suspense>
      <div className="flex flex-col space-y-2 [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
        {starts?.map((examplePrompt, index) => {
          return (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              onClick={(event) => {
                // sendMessage?.(event, examplePrompt.title);
                onSelect(examplePrompt);
              }}
              className="group flex items-center w-full gap-2 justify-center bg-transparent text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-theme"
            >
              {examplePrompt.title}
              {/* <div className="i-ph:arrow-bend-down-left" /> */}
              {/* <IconTelgram /> */}
              <Icons.PaperPlane />
            </button>
          );
        })}
      </div>
    </div>
  );
};
