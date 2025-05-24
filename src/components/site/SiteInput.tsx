"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
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
import React, { Suspense, useMemo } from "react";

export const SiteInput = (props: React.ComponentProps<"input">) => {
  return (
    <Suspense>
      <MtErrorBoundary>
        <SiteInputImpl {...props} />
      </MtErrorBoundary>
    </Suspense>
  );
};

const SiteInputImpl = (props: React.ComponentProps<"input">) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const placeholder = "选择站点...";
  const emptyLabel = props.placeholder || "选择站点";
  const query = useSuspenseQuery({
    ...siteListSitesOptions(),
  });
  const items = query.data?.data.map((item) => ({
    label: item.title,
    value: item.id,
  }));

  const displayValue = useMemo(() => {
    const fined = items.find((item) => {
      return item.value?.toLocaleLowerCase() === value?.toLocaleLowerCase();
    });
    return fined ? fined.label : placeholder;
  }, [value, items]);

  const handleChange = (item: { label: string; value: string }) => {
    setValue(item.value);
    setOpen(false);
    const event = {
      target: {
        value: item.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    props.onChange?.(event);
  };
  return (
    <>
      {/* <DebugValue data={query.data} /> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            // role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {displayValue}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              <CommandGroup>
                {items?.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleChange(item)}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
