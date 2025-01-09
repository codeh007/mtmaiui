"use client";

import type { ColumnFiltersState } from "@tanstack/react-table";
import { useState } from "react";
import { BiCard, BiTable } from "react-icons/bi";
import { useTenant } from "../../hooks/useAuth";
import { useBasePath } from "../../hooks/useBasePath";
import { AgentNodeCard } from "./agentnode-card";
import { columns } from "./agentnode-columns";
import { AgentNodeEmptyState } from "./emptyState";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { agentNodeListOptions } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { DataTable } from "mtxuilib/data-table/data-table";
import { Icons } from "mtxuilib/icons/icons";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import Link from "next/link";

export default function AgentNodeListView() {
  const tenant = useTenant();
  if (!tenant) throw new Error("tenant required");
  const basePath = useBasePath();
  const [rotate, setRotate] = useState(false);
  const [cardToggle, setCardToggle] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: ["ACTIVE", "PAUSED"],
    },
  ]);
  const agentnodesQuery = useSuspenseQuery({
    ...agentNodeListOptions({
      path: {
        tenant: tenant.metadata.id,
      },
    }),
  });

  const AgentNodeActions = [
    <Button
      key="card-toggle"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        setCardToggle((t) => !t);
      }}
      variant={"outline"}
      aria-label="Toggle card/table view"
    >
      {!cardToggle ? (
        <BiCard className={"h-4 w-4 "} />
      ) : (
        <BiTable className={"h-4 w-4 "} />
      )}
    </Button>,
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        agentnodesQuery.refetch();
        setRotate(!rotate);
      }}
      variant={"outline"}
      aria-label="Refresh events list"
    >
      <ArrowPathIcon
        className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`}
      />
    </Button>,
    <Link
      key={"create-agentnode"}
      href={`${basePath}/agentnode/create`}
      className={buttonVariants({ variant: "outline", size: "icon" })}
    >
      <Icons.plus className="size-4" />
    </Link>,
    <DebugValue key={"debug"} data={{ data: agentnodesQuery.data }} />,
  ];
  return (
    <>
      {agentnodesQuery.data && (
        <DataTable
          columns={columns}
          data={agentnodesQuery.data?.rows}
          pageCount={1}
          filters={[
            {
              columnId: "status",
              title: "Status",
              options: [
                { value: "ACTIVE", label: "Active" },
                { value: "PAUSED", label: "Paused" },
                { value: "INACTIVE", label: "Inactive" },
              ],
            },
          ]}
          emptyState={<AgentNodeEmptyState />}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          card={
            cardToggle
              ? {
                  component: AgentNodeCard,
                }
              : undefined
          }
          actions={AgentNodeActions}
        />
      )}
    </>
  );
}
