"use client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
} from "@radix-ui/react-icons";

import { SaveIcon } from "lucide-react";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mtxuilib/ui/tooltip";
import { useBasePath } from "../../../../hooks/useBasePath";
import { EditableNodeTitle } from "./nodes/components/EditableNodeTitle";

type Props = {
  workflowPermanentId: string;
  title: string;
  parametersPanelOpen: boolean;
  onParametersClick: () => void;
  onSave: () => void;
  onTitleChange: (title: string) => void;
};

export function WorkflowHeader({
  workflowPermanentId,
  title,
  parametersPanelOpen,
  onParametersClick,
  onSave,
  onTitleChange,
}: Props) {
  const router = useMtRouter();
  const basePath = useBasePath();
  return (
    <div
      className={cn(
        "flex h-full w-full justify-between rounded-xl px-6 py-2 backdrop-blur-sm bg-white/10 static top-0 ",
      )}
    >
      <div className="flex h-full items-center">
        <EditableNodeTitle
          editable={true}
          onChange={onTitleChange}
          value={title}
          titleClassName="text-3xl"
          inputClassName="text-3xl"
        />
      </div>
      <div className="flex h-full items-center justify-end gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="tertiary"
                className="size-10"
                onClick={() => {
                  onSave();
                }}
              >
                <SaveIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="tertiary" size="lg" onClick={onParametersClick}>
          <span className="mr-2">Parameters</span>
          {parametersPanelOpen ? (
            <ChevronUpIcon className="h-6 w-6" />
          ) : (
            <ChevronDownIcon className="h-6 w-6" />
          )}
        </Button>
        <Button
          size="lg"
          onClick={() => {
            router.push(`${basePath}/workflows/${workflowPermanentId}/run`);
          }}
        >
          <PlayIcon className="mr-2 h-6 w-6" />
          Run
        </Button>
      </div>
    </div>
  );
}
