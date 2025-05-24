import { createLazyFileRoute } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { siteListOptions } from "mtmaiapi";
import { SiteListViewHeader } from "../../components/site/SiteListViewHeader";

export const Route = createLazyFileRoute("/site/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const listSites = useQuery({
    ...siteListOptions({
      path: {
        tenant: tid,
      },
    }),
  });
  const isEmpty = useMemo(() => {
    return listSites.data?.rows?.length === 0;
  }, [listSites.data?.rows]);
  return (
    <div className="flex flex-col h-full w-full ">
      {isEmpty ? (
        <>
          <span>没有可用数据</span>
        </>
      ) : (
        <>
          <SiteListViewHeader />

          <div className="flex flex-col gap-2">
            {/* {listSites.data?.rows?.map((site) => (
              <SiteListItem key={site.metadata?.id} site={site} />
            ))} */}
          </div>
        </>
      )}
    </div>
  );
}
