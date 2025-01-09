"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { siteListSitesOptions } from "mtmaiapi/@tanstack/react-query.gen";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { cn } from "mtxuilib/lib/utils";
import { useBasePath } from "../../hooks/useBasePath";
export const SiteListDropdown = () => {
  const router = useMtRouter();
  const sitesQuery = useSuspenseQuery({
    ...siteListSitesOptions(),
  });

  const sites = sitesQuery.data?.data;
  const basePath = useBasePath();
  return (
    <>
      <div className="flex flex-col gap-2 p-4 pt-0">
        {sites?.map((item) => (
          <button
            type="button"
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              // mail.selected === item.id && "bg-muted"
            )}
            onClick={() => {
              router.push(`${basePath}/site/${item.id}`);
            }}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.title}</div>
                  {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    // mail.selected === item.id
                    //   ? "text-foreground"
                    //   : "text-muted-foreground"
                  )}
                >
                  {item.created_at &&
                    formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.description}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item?.description?.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
