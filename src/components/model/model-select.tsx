"use client";

import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import * as React from "react";

import { useQuery } from "@tanstack/react-query";
import { modelListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "mtxuilib/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "mtxuilib/ui/popover";
import { useTenantId } from "../../hooks/useAuth";

export function ModelSelect(props: React.ComponentProps<"input">) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const tid = useTenantId();
  const modelQuery = useQuery({
    ...modelListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

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
            ? modelQuery.data?.rows?.find(
                (model) => model.metadata?.id === value,
              )?.name
            : "选择模型"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="选择模型" />
          <CommandList>
            <CommandEmpty>
              No model found.
              <CustomLink
                to={"/model/new"}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                <PlusIcon className="h-4 w-4" />
              </CustomLink>
            </CommandEmpty>
            <CommandGroup>
              {modelQuery.data?.rows?.map((model) => (
                <CommandItem
                  key={model.metadata?.id}
                  value={model.metadata?.id}
                  onSelect={(currentValue) => {
                    props.onChange?.(currentValue as any);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {model.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === model.metadata?.id
                        ? "opacity-100"
                        : "opacity-0",
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
