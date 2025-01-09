"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { siteListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useMemo } from "react";
import { useTenant } from "../../hooks/useAuth";
import { SiteListViewHeader } from "./SiteListViewHeader";

export default function SiteListView() {
  const router = useMtRouter();
  const tenant = useTenant();
  const listQuery = useSuspenseQuery({
    ...siteListOptions({
      path: {
        tenant: tenant.metadata.id,
      },
    }),
  });
  const isEmpty = useMemo(() => {
    return listQuery.data?.rows?.length === 0;
  }, [listQuery.data?.rows]);
  return (
    <div className="flex flex-col h-full w-full ">
      {isEmpty ? (
        // <ListViewEmpty message="没有可用数据" linkToCreate="/dash/site/new" />
        <></>
      ) : (
        <>
          <SiteListViewHeader />
          <DebugValue value={listQuery.data!} />
        </>
      )}
    </div>
  );
}
