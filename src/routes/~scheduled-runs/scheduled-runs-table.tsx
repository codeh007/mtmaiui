"use client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import {
  ScheduledRunStatus,
  type ScheduledWorkflows,
  ScheduledWorkflowsOrderByField,
  WorkflowRunOrderByDirection,
  workflowListOptions,
  workflowScheduledListOptions,
} from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import {
  type FilterOption,
  type ToolbarFilters,
  ToolbarType,
} from "mtxuilib/data-table/data-table-toolbar";
import { Button } from "mtxuilib/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTenantId } from "../../hooks/useAuth";
import { DeleteScheduledRun } from "./delete-scheduled-runs";
import { columns } from "./scheduled-runs-columns";

export interface ScheduledWorkflowRunsTableProps {
  createdAfter?: string;
  createdBefore?: string;
  workflowId?: string;
  parentWorkflowRunId?: string;
  parentStepRunId?: string;
  initColumnVisibility?: VisibilityState;
  filterVisibility?: { [key: string]: boolean };
  refetchInterval?: number;
  showMetrics?: boolean;
}

export function ScheduledRunsTable({
  workflowId,
  initColumnVisibility = {
    createdAt: false,
  },
  filterVisibility = {},
  parentWorkflowRunId,
  parentStepRunId,
  refetchInterval = 5000,
}: ScheduledWorkflowRunsTableProps) {
  const searchParams = useSearchParams();
  // const router = useMtRouter();
  // const tenant = useTenant();
  const tid = useTenantId();

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      return sortParam.split(",").map((param) => {
        const [id, desc] = param.split(":");
        return { id, desc: desc === "desc" };
      });
    }
    return [];
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filtersParam = searchParams.get("filters");
    if (filtersParam) {
      return JSON.parse(filtersParam);
    }
    return [];
  });

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initColumnVisibility);

  const [pagination, setPagination] = useState<PaginationState>(() => {
    const pageIndex = Number(searchParams.get("pageIndex")) || 0;
    const pageSize = Number(searchParams.get("pageSize")) || 50;
    return { pageIndex, pageSize };
  });

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (sorting.length) {
      newSearchParams.set(
        "orderDirection",
        sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
      );
    } else {
      newSearchParams.delete("orderDirection");
    }
    if (columnFilters.length) {
      newSearchParams.set("filters", JSON.stringify(columnFilters));
    } else {
      newSearchParams.delete("filters");
    }
    newSearchParams.set("pageIndex", pagination.pageIndex.toString());
    newSearchParams.set("pageSize", pagination.pageSize.toString());

    if (newSearchParams.toString() !== searchParams.toString()) {
      // router.setSearchParams(newSearchParams);
    }
  }, [sorting, columnFilters, pagination, searchParams]);

  const [pageSize, setPageSize] = useState<number>(50);

  const offset = useMemo(() => {
    if (!pagination) {
      return;
    }

    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);

  const workflow = useMemo<string | undefined>(() => {
    if (workflowId) {
      return workflowId;
    }

    const filter = columnFilters.find((filter) => filter.id === "Workflow");

    if (!filter) {
      return;
    }

    const vals = filter?.value as Array<string>;
    return vals[0];
  }, [columnFilters, workflowId]);

  const statuses = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "status");

    if (!filter) {
      return;
    }

    return filter?.value as Array<ScheduledRunStatus>;
  }, [columnFilters]);

  const AdditionalMetadataFilter = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "Metadata");

    if (!filter) {
      return;
    }

    return filter?.value as Array<string>;
  }, [columnFilters]);

  const orderByDirection = useMemo(():
    | WorkflowRunOrderByDirection
    | undefined => {
    if (!sorting.length) {
      return;
    }

    return sorting[0]?.desc
      ? WorkflowRunOrderByDirection.DESC
      : WorkflowRunOrderByDirection.ASC;
  }, [sorting]);

  const orderByField = useMemo(():
    | ScheduledWorkflowsOrderByField
    | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "createdAt":
        return ScheduledWorkflowsOrderByField.CREATED_AT;
      default:
        return ScheduledWorkflowsOrderByField.TRIGGER_AT;
    }
  }, [sorting]);

  // const listWorkflowRunsQuery = useQuery({
  //   ...queries.scheduledRuns.list(tenant.metadata.id, {
  //     offset,
  //     limit: pageSize,
  //     statuses,
  //     workflowId: workflow,
  //     parentWorkflowRunId,
  //     parentStepRunId,
  //     orderByDirection,
  //     orderByField,
  //     additionalMetadata: AdditionalMetadataFilter,
  //   }),
  //   placeholderData: (prev) => prev,
  //   refetchInterval,
  // });

  // const listWorkflowRunsQuery = useQuery(
  //   "get",
  //   "/api/v1/tenants/{tenant}/workflows/scheduled",
  //   {
  //     params: {
  //       path: {
  //         tenant: tenant.metadata.id,
  //       },
  //       query: {
  //         offset,
  //         limit: pageSize,
  //         statuses,
  //         workflowId: workflow,
  //         parentWorkflowRunId,
  //         parentStepRunId,
  //         orderByDirection,
  //         orderByField,
  //         additionalMetadata: AdditionalMetadataFilter,
  //       },
  //     },
  //   },
  //   {
  //     placeholderData: (prev) => prev,
  //     refetchInterval,
  //   },
  // );

  const listWorkflowRunsQuery = useQuery({
    ...workflowScheduledListOptions({
      path: {
        tenant: tid,
      },
      query: {
        offset,
        limit: pageSize,
        statuses,
        workflowId: workflow,
        parentWorkflowRunId,
        parentStepRunId,
        orderByDirection,
        orderByField,
        additionalMetadata: AdditionalMetadataFilter,
      },
    }),
    placeholderData: (prev) => prev,
    refetchInterval,
  });

  // const {
  //   data: workflowKeys,
  //   isLoading: workflowKeysIsLoading,
  //   error: workflowKeysError,
  // } = useQuery({
  //   ...queries.workflows.list(tenant.metadata.id),
  // });

  // const {
  //   data: workflowKeys,
  //   isLoading: workflowKeysIsLoading,
  //   error: workflowKeysError,
  // } = mtmapi.useQuery("get", "/api/v1/tenants/{tenant}/workflows", {
  //   params: {
  //     path: {
  //       tenant: tenant.metadata.id,
  //     },
  //   },
  // });
  const {
    data: workflowKeys,
    isLoading: workflowKeysIsLoading,
    error: workflowKeysError,
  } = useQuery({
    ...workflowListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // const selectedRuns = useMemo(() => {
  //   return Object.entries(rowSelection)
  //     .filter(([, selected]) => !!selected)
  //     .map(([id]) => (listWorkflowRunsQuery.data?.rows || [])[Number(id)]);
  // }, [listWorkflowRunsQuery.data?.rows, rowSelection]);

  // const cancelWorkflowRunMutation = useMutation({
  //   mutationKey: ['workflow-run:cancel', tenant.metadata.id, selectedRuns],
  //   mutationFn: async () => {
  //     const tenantId = tenant.metadata.id;
  //     const workflowRunIds = selectedRuns.map((wr) => wr.metadata.id);

  //     invariant(tenantId, 'has tenantId');
  //     invariant(workflowRunIds, 'has runIds');

  //     const res = await api.workflowRunCancel(tenantId, {
  //       workflowRunIds,
  //     });

  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: queries.workflowRuns.list(tenant.metadata.id, {}).queryKey,
  //     });
  //   },
  //   onError: handleApiError,
  // });

  const workflowKeyFilters = useMemo((): FilterOption[] => {
    return (
      workflowKeys?.rows?.map((key) => ({
        value: key.metadata.id,
        label: key.name,
      })) || []
    );
  }, [workflowKeys]);

  const workflowRunStatusFilters = useMemo((): FilterOption[] => {
    return [
      {
        value: ScheduledRunStatus.SCHEDULED,
        label: "Scheduled",
      },
      {
        value: ScheduledRunStatus.SUCCEEDED,
        label: "Succeeded",
      },
      {
        value: ScheduledRunStatus.FAILED,
        label: "Failed",
      },
      {
        value: ScheduledRunStatus.RUNNING,
        label: "Running",
      },
      {
        value: ScheduledRunStatus.QUEUED,
        label: "Queued",
      },
      {
        value: ScheduledRunStatus.PENDING,
        label: "Pending",
      },
    ];
  }, []);

  const filters: ToolbarFilters = [
    {
      columnId: "Workflow",
      title: "Workflow",
      options: workflowKeyFilters,
      type: ToolbarType.Radio,
    },
    {
      columnId: "status",
      title: "Status",
      options: workflowRunStatusFilters,
    },
    {
      columnId: "Metadata",
      title: "Metadata",
      type: ToolbarType.KeyValue,
    },
  ].filter((filter) => filterVisibility[filter.columnId] !== false);

  const [rotate, setRotate] = useState(false);

  const refetch = () => {
    listWorkflowRunsQuery.refetch();
  };

  const actions = [
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        refetch();
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

  const [showScheduledRunRevoke, setShowScheduledRunRevoke] = useState<
    ScheduledWorkflows | undefined
  >(undefined);

  const isLoading = listWorkflowRunsQuery.isFetching || workflowKeysIsLoading;

  return (
    <>
      <DeleteScheduledRun
        tenant={tid}
        scheduledRun={showScheduledRunRevoke}
        setShowScheduledRunRevoke={setShowScheduledRunRevoke}
        onSuccess={() => {
          refetch();
          setShowScheduledRunRevoke(undefined);
        }}
      />
      <DataTable
        emptyState={<>No workflow runs found with the given filters.</>}
        error={workflowKeysError}
        isLoading={isLoading}
        columns={columns({
          onDeleteClick: (row) => {
            setShowScheduledRunRevoke(row);
          },
        })}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        data={listWorkflowRunsQuery.data?.rows || []}
        filters={filters}
        actions={actions}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        pagination={pagination}
        setPagination={setPagination}
        onSetPageSize={setPageSize}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        pageCount={listWorkflowRunsQuery.data?.pagination?.num_pages || 0}
        showColumnToggle={true}
      />
    </>
  );
}
