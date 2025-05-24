"use client";

import { useQuery } from "@tanstack/react-query";
import { type SiteHost, siteHostListOptions } from "mtmaiapi";
import { SiteHostCreateDialog } from "./SiteHostNewView";
interface SiteHostListViewProps {
  siteId: string;
  tid: string;
}
export function SiteHostListView({ siteId, tid }: SiteHostListViewProps) {
  const siteHostQuery = useQuery({
    ...siteHostListOptions({
      path: {
        tenant: tid,
        site: siteId,
      },
      query: {
        offset: 0,
        // limit: 100,
      },
    }),
  });
  return (
    <>
      <div className="flex p-2 justify-end">
        <SiteHostCreateDialog siteId={siteId} tid={tid} />
      </div>
      {siteHostQuery.data?.rows?.map((host) => (
        <SiteHostItem key={host.metadata.id} host={host} />
      ))}
    </>
  );
}

function SiteHostItem({ host }: { host: SiteHost }) {
  return (
    <div className="bg-slate-100 p-2 space-y-2">
      {host.metadata.id}
      <div>{host.host}</div>
    </div>
  );
}
