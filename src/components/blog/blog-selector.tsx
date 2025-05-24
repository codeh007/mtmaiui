"use client";

import {
  CheckCirclFillIcon,
  ChevronDownIcon,
} from "mtxuilib/icons/aichatbot.icons";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "mtxuilib/ui/dropdown-menu";
import {
  type ComponentProps,
  startTransition,
  useOptimistic,
  useState,
} from "react";
import { useTenant, useTenantId } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { blogListOptions } from "mtmaiapi";
export function BlogSelector({
  className,
  selectedBlogId,
}: {
  selectedBlogId: string;
} & ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedBlogId);


  const tid = useTenantId();

  const blogsQuery = useQuery({
    ...blogListOptions({
        path: {
          tenant: tid,
        },
    })
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className,
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectModel?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {blogsQuery.data?.rows?.map((item, i) => (
          <DropdownMenuItem
            key={item.id}
            onSelect={() => {
              setOpen(false);

              startTransition(() => {
                setOptimisticModelId(item.id);
                // saveModelId(item.id);
              });
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={item.id === optimisticModelId}
          >
            <div className="flex flex-col gap-1 items-start">
              {item.title}
              {/* {item.description && (
                <div className="text-xs text-muted-foreground">
                  {item.description}
                </div>
              )} */}
            </div>
            <div className="text-primary dark:text-primary-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCirclFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
