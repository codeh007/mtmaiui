"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { useQuery } from "@tanstack/react-query";
// import { proxyListOptions } from "mtmaiapi";
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
import { useTenantId } from "../../hooks/useAuth";

export function ProxySelect(props: React.ComponentProps<"input">) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const tid = useTenantId();
  const proxylistQuery = useQuery({
    ...proxyListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

  const rows = proxylistQuery.data?.rows || [];

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
            ? proxylistQuery.data?.rows?.find((row) => row.metadata.id === value)?.name
            : "选择代理"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="选择组件类型" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {rows?.map((row) => (
                <CommandItem
                  key={row.metadata.id}
                  value={row.metadata.id}
                  onSelect={(currentValue) => {
                    props.onChange?.(currentValue as any);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {row.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === row.metadata.id ? "opacity-100" : "opacity-0",
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
