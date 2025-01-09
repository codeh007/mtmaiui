"use client";

import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { Icons } from "mtxuilib/icons/icons";
import { MtLink } from "mtxuilib/mt/mtlink";
import { Input } from "mtxuilib/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { useBasePath } from "../../hooks/useBasePath";

export const SiteListViewHeader = () => {
  const form = useZodForm({
    schema: z.any(),
    defaultValues: {},
  });

  const handleSearch = () => {
    form.handleSubmit((values) => {
      console.log(values);
    })();
  };

  const debouncedSearch = useDebouncedCallback(handleSearch, 500);
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      debouncedSearch();
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSearch]);

  const basePath = useBasePath();
  return (
    <div className="p-2">
      <ZForm
        form={form}
        className="flex items-center space-x-2 p-1"
        handleSubmit={handleSearch}
      >
        <div className="flex-1">
          <Input type="q" placeholder="search..." {...form.register("q")} />
        </div>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <MtLink
                href={`${basePath}/site/create`}
                className="w-8 h-8 rounded-full p-1"
                variant={"outline"}
              >
                <Icons.plus className="size-5" />
              </MtLink>
            </TooltipTrigger>
            <TooltipContent side="bottom">new</TooltipContent>
          </Tooltip>
        </div>
      </ZForm>
    </div>
  );
};
