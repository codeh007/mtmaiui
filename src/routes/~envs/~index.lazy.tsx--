"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
// import { envGetOptions } from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { Icons } from "mtxuilib/icons/icons";
import { BiCard, BiTable } from "react-icons/bi";

import { cn } from "mtxuilib/lib/utils";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button, buttonVariants } from "mtxuilib/ui/button";

import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useMemo, useState } from "react";

import { EnvCard } from "./_components/EnvCard";
import { envColumns } from "./_components/EnvColumn";
import { EnvEmptyState } from "./_components/emptyState";

export const Route = createLazyFileRoute("/envs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [cardToggle, setCardToggle] = useState(true);
  const [rotate, setRotate] = useState(false);
  const envsQuery = useSuspenseQuery({
    ...envGetOptions({}),
  });

  const data = useMemo(() => {
    const data = envsQuery.data?.rows || [];

    return data;
  }, [envsQuery.data?.rows]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "title",
      desc: true,
    },
  ]);

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
      {!cardToggle ? <BiCard className="size-4" /> : <BiTable className="size-4" />}
    </Button>,
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        envsQuery.refetch();
        setRotate(!rotate);
      }}
      variant={"outline"}
      aria-label="Refresh events list"
    >
      <ArrowPathIcon className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`} />
    </Button>,
    <CustomLink
      key="create-env"
      to={"create"}
      search={{ siteId: siteId }}
      className={cn("h-8 px-2 lg:px-3", buttonVariants({ variant: "outline" }))}
      aria-label="Create new post"
    >
      <Icons.plus className="size-4" />
    </CustomLink>,
  ];
  return (
    <>
      <DataTable
        columns={envColumns}
        data={data}
        pageCount={1}
        filters={[]}
        emptyState={EnvEmptyState}
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
                component: EnvCard,
              }
            : undefined
        }
      />
    </>
  );
}
