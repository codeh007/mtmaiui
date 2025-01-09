import { cn } from "mtxuilib/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mtxuilib/ui/tooltip";
import { useState } from "react";
import { HorizontallyResizingInput } from "./HorizontallyResizingInput";

type Props = {
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
  titleClassName?: string;
  inputClassName?: string;
};

export function EditableNodeTitle({
  value,
  editable,
  onChange,
  titleClassName,
  inputClassName,
}: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {!editing ? (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <h1
              className={cn("cursor-text", titleClassName)}
              onClick={() => {
                setEditing(true);
              }}
            >
              {value}
            </h1>
          ) : (
            <HorizontallyResizingInput
              disabled={!editable}
              size={1}
              autoFocus
              className={cn("nopan w-min border-0 p-0", inputClassName)}
              onBlur={(event) => {
                if (!editable) {
                  event.currentTarget.value = value;
                  return;
                }
                if (event.currentTarget.value !== value) {
                  onChange(event.target.value);
                }
                setEditing(false);
              }}
              onKeyDown={(event) => {
                if (!editable) {
                  return;
                }
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
                if (event.key === "Escape") {
                  event.currentTarget.value = value;
                  event.currentTarget.blur();
                }
              }}
              defaultValue={value}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>Click to edit</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
