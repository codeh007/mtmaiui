"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "mtxuilib/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "mtxuilib/ui/popover";
import { useWorkbenchStore } from "../../stores/workbrench.store";

const adkAppNames = [
  {
    value: "instagram_agent",
    label: "Instagram 自动化",
  },
  {
    value: "root",
    label: "测试",
  },
];

export function AdkAppSelect(props: React.ComponentProps<"input">) {
  const [open, setOpen] = React.useState(false);
  const value = useWorkbenchStore((x) => x.adkAppName);
  const setAdkAppName = useWorkbenchStore((x) => x.setAdkAppName);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? adkAppNames.find((framework) => framework.value === value)?.label
            : "选择应用..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="选择应用..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {adkAppNames.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    props.onChange?.(currentValue as any);
                    setAdkAppName(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
