"use client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { workflowListOptions } from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { useState } from "react";
import { BiCard, BiTable } from "react-icons/bi";
import { useTenant } from "../../hooks/useAuth";
import { useBasePath } from "../../hooks/useBasePath";
import { WorkflowCard } from "./WorkflowCard";
import { WorkflowEmptyCard } from "./WorkflowEmptyCard";
import { columns } from "./workflow-columns";
import { Button } from "mtxuilib/ui/button";

export function WorkflowTable() {
  const tenant = useTenant();
  const basePath = useBasePath(); // 如果有这个 hook，确保它在这里调用
  const [cardToggle, setCardToggle] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rotate, setRotate] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    {
      // id: "lastRun",
      // id: "name",
      id: "createdAt",
      desc: true,
    },
  ]);

  const listWorkflowQuery = useQuery({
    ...workflowListOptions({
      path: {
        tenant: tenant.metadata.id,
      },
    }),
    refetchInterval: 5000,
  });

  const actions = [
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
        <BiCard className="size-4" />
      ) : (
        <BiTable className="size-4" />
      )}
    </Button>,
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        listWorkflowQuery.refetch();
        setRotate(!rotate);
      }}
      variant={"outline"}
      aria-label="Refresh events list"
    >
      <ArrowPathIcon
        className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`}
      />
    </Button>,
  ];

  return (
    <DataTable
      columns={columns}
      data={listWorkflowQuery.data?.rows || []}
      pageCount={1}
      filters={[]}
      emptyState={<WorkflowEmptyCard />}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      sorting={sorting}
      setSorting={setSorting}
      manualSorting={false}
      actions={actions}
      manualFiltering={false}
      card={
        cardToggle
          ? {
              component: WorkflowCard,
            }
          : undefined
      }
    />
  );
}
