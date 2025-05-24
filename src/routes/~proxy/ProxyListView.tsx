"use client";

// import { type Proxy as MtProxy, proxyListOptions } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { TaskDateBadge } from "mtxuilib/mt/relative-date";
import { useTenantId } from "../../hooks/useAuth";

export function ProxyListView() {
  const tid = useTenantId();
  // const listProxyQuery = useSuspenseQuery({
  //   ...proxyListOptions({
  //     path: {
  //       tenant: tid,
  //     },
  //   }),
  // });
  return (
    <div className="space-y-2 w-full flex flex-col gap-2">
      {/* {listProxyQuery.data?.rows?.map((row) => (
        <ProxyListItem key={row.metadata.id} row={row} />
      ))} */}
    </div>
  );
}

function ProxyListItem({ row }: { row: MtProxy }) {
  const proxyId = row.metadata.id;
  const proxyName = row.name;
  return (
    <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-md border border-slate-200">
      <div>
        <CustomLink to={`/proxy/${row.metadata.id}`}>{row.name}</CustomLink>
      </div>

      <div>
        <TaskDateBadge
          date_created_at={row.metadata.createdAt}
          date_updated_at={row.metadata.updatedAt}
        />
        <span>{row.url}</span>
        {/* <span>
          <CustomLink
            to={`/proxy/${proxyId}/trigger/${proxyName}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            启动
          </CustomLink>
        </span> */}
      </div>
    </div>
  );
}
