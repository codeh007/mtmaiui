"use client";
import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

import api, {
  type ReplayWorkflowRunsRequest,
  WorkflowRunOrderByDirection,
  WorkflowRunOrderByField,
  WorkflowRunStatus,
} from "mtmaiapi/api";
import { DateTimePicker } from "mtxuilib/components/time-picker/date-time-picker";
import { DataTable } from "mtxuilib/data-table/data-table";
import {
  type FilterOption,
  type ToolbarFilters,
  ToolbarType,
} from "mtxuilib/data-table/data-table-toolbar";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import type { AdditionalMetadataClick } from "../../components/events/additional-metadata";
import { useApiError } from "../../hooks/useApi";
import { useTenant } from "../../hooks/useAuth";
import { useMtmClient } from "../../hooks/useMtmapi";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import { columns } from "./workflow-runs-columns";
import { WorkflowRunsMetricsView } from "./workflow-runs-metrics";
import { Button } from "mtxuilib/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "mtxuilib/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "mtxuilib/ui/select";
import { Separator } from "mtxuilib/ui/separator";
import { Skeleton } from "mtxuilib/ui/skeleton";

export interface WorkflowRunsTableProps {
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

export const getCreatedAfterFromTimeRange = (timeRange?: string) => {
  switch (timeRange) {
    case "1h":
      return new Date(Date.now() - 60 * 60 * 1000).toISOString();
    case "6h":
      return new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    case "1d":
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    case "7d":
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
};

export function WorkflowRunsTable({
  createdAfter: createdAfterProp,
  workflowId,
  initColumnVisibility = {},
  filterVisibility = {},
  parentWorkflowRunId,
  parentStepRunId,
  refetchInterval = 5000,
  showMetrics = false,
}: WorkflowRunsTableProps) {
  const searchParams = useSearchParams();
  const tenant = useTenant();
  const router = useMtRouter();
  // const cloudMeta = useCloudApiMeta();
  const mtmapi = useMtmClient();

  const [viewQueueMetrics, setViewQueueMetrics] = useState(false);

  const defaultTimeRange = useMtmaiV2((x) => x.lastTimeRange);
  const setDefaultTimeRange = useMtmaiV2((x) => x.setLastTimeRange);

  // customTimeRange does not get set in the atom,
  const [customTimeRange, setCustomTimeRange] = useState<string[] | undefined>(
    () => {
      const timeRangeParam = searchParams.get("customTimeRange");
      if (timeRangeParam) {
        return timeRangeParam.split(",").map((param) => {
          return new Date(param).toISOString();
        });
      }
      return undefined;
    },
  );

  const [createdAfter, setCreatedAfter] = useState<string | undefined>(
    createdAfterProp ||
      getCreatedAfterFromTimeRange(defaultTimeRange) ||
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  );

  const [finishedBefore, setFinishedBefore] = useState<string | undefined>();

  // create a timer which updates the createdAfter date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (customTimeRange) {
        return;
      }

      setCreatedAfter(
        getCreatedAfterFromTimeRange(defaultTimeRange) ||
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      );
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [defaultTimeRange, customTimeRange]);

  // whenever the time range changes, update the createdAfter date
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (customTimeRange && customTimeRange.length === 2) {
      setCreatedAfter(customTimeRange[0]);
      setFinishedBefore(customTimeRange[1]);
    } else if (defaultTimeRange) {
      setCreatedAfter(getCreatedAfterFromTimeRange(defaultTimeRange));
      setFinishedBefore(undefined);
    }
  }, [defaultTimeRange, customTimeRange, setCreatedAfter]);

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

    if (customTimeRange && customTimeRange.length === 2) {
      newSearchParams.set("customTimeRange", customTimeRange?.join(","));
    } else {
      newSearchParams.delete("customTimeRange");
    }

    if (newSearchParams.toString() !== searchParams.toString()) {
      router.setSearchParams(newSearchParams);
    }
  }, [
    sorting,
    columnFilters,
    pagination,
    customTimeRange,
    router.setSearchParams,
    searchParams,
  ]);

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

    return filter?.value as Array<WorkflowRunStatus>;
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

  const orderByField = useMemo((): WorkflowRunOrderByField | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "Duration":
        return WorkflowRunOrderByField.Duration;
      case "Finished at":
        return WorkflowRunOrderByField.FinishedAt;
      case "Started at":
        return WorkflowRunOrderByField.StartedAt;
      case "Seen at":
        return WorkflowRunOrderByField.CreatedAt;
      default:
        return WorkflowRunOrderByField.CreatedAt;
    }
  }, [sorting]);
  const listWorkflowRunsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflows/runs",
    {
      params: {
        path: {
          tenant: tenant.metadata.id,
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
          createdAfter,
          finishedBefore,
        },
      },
    },
    {
      placeholderData: (prev) => prev,
      refetchInterval,
    },
  );

  const metricsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflows/runs/metrics",
    {
      params: {
        path: {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          tenant: tenant!.metadata.id,
        },
        query: {
          workflowId: workflow,
          parentWorkflowRunId,
          parentStepRunId,
          additionalMetadata: AdditionalMetadataFilter,
          createdAfter,
        },
      },
    },
    {
      placeholderData: (prev) => prev,
      refetchInterval,
    },
  );
  const tenantMetricsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/step-run-queue-metrics",
    {
      params: {
        path: {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          tenant: tenant!.metadata.id,
        },
      },
    },
    {
      refetchInterval,
    },
  );
  const {
    data: workflowKeys,
    isLoading: workflowKeysIsLoading,
    error: workflowKeysError,
  } = mtmapi.useQuery("get", "/api/v1/tenants/{tenant}/workflows", {
    params: {
      path: {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        tenant: tenant!.metadata.id,
      },
    },
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedRuns = useMemo(() => {
    return Object.entries(rowSelection)
      .filter(([, selected]) => !!selected)
      .map(([id]) => (listWorkflowRunsQuery.data?.rows || [])[Number(id)]);
  }, [listWorkflowRunsQuery.data?.rows, rowSelection]);

  const { handleApiError } = useApiError({});

  const cancelWorkflowRunMutation = useMutation({
    mutationKey: ["workflow-run:cancel", tenant.metadata.id, selectedRuns],
    mutationFn: async () => {
      const tenantId = tenant.metadata.id;
      const workflowRunIds = selectedRuns.map((wr) => wr.metadata.id);

      invariant(tenantId, "has tenantId");
      invariant(workflowRunIds, "has runIds");

      const res = await api.workflowRunCancel(tenantId, {
        workflowRunIds,
      });

      return res.data;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: queries.workflowRuns.list(tenant.metadata.id, {}).queryKey,
      // });
    },
    onError: handleApiError,
  });

  const replayWorkflowRunsMutation = useMutation({
    mutationKey: ["workflow-run:update:replay", tenant.metadata.id],
    mutationFn: async (data: ReplayWorkflowRunsRequest) => {
      await api.workflowRunUpdateReplay(tenant.metadata.id, data);
    },
    onSuccess: () => {
      setRowSelection({});

      // bit hacky, but workflow run statuses aren't updated immediately after replay
      setTimeout(() => {
        listWorkflowRunsQuery.refetch();
      }, 1000);
    },
    onError: handleApiError,
  });

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
        value: WorkflowRunStatus.SUCCEEDED,
        label: "Succeeded",
      },
      {
        value: WorkflowRunStatus.FAILED,
        label: "Failed",
      },
      {
        value: WorkflowRunStatus.RUNNING,
        label: "Running",
      },
      {
        value: WorkflowRunStatus.QUEUED,
        label: "Queued",
      },
      {
        value: WorkflowRunStatus.PENDING,
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
    tenantMetricsQuery.refetch();
    metricsQuery.refetch();
  };

  const actions = [
    <Button
      disabled={!Object.values(rowSelection).some((selected) => !!selected)}
      key="cancel"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        cancelWorkflowRunMutation.mutate();
      }}
      variant={"outline"}
      aria-label="Cancel Selected Runs"
    >
      <XMarkIcon className={"mr-2 h-4 w-4 transition-transform"} />
      Cancel
    </Button>,
    <Button
      disabled={!Object.values(rowSelection).some((selected) => !!selected)}
      key="replay"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        replayWorkflowRunsMutation.mutate({
          workflowRunIds: selectedRuns.map((run) => run.metadata.id),
        });
      }}
      variant={"outline"}
      aria-label="Replay Selected Runs"
    >
      <ArrowPathRoundedSquareIcon className="mr-2 h-4 w-4 transition-transform" />
      Replay
    </Button>,
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

  const isLoading =
    listWorkflowRunsQuery.isFetching ||
    workflowKeysIsLoading ||
    metricsQuery.isLoading;

  const onAdditionalMetadataClick = ({
    key,
    value,
  }: AdditionalMetadataClick) => {
    setColumnFilters((prev) => {
      let newFilters = prev;
      const metadataFilter = prev.find((filter) => filter.id === "Metadata");
      if (metadataFilter) {
        newFilters = prev.filter((filter) => filter.id !== "Metadata");
      }
      return [
        ...newFilters,
        {
          id: "Metadata",
          value: [`${key}:${value}`],
        },
      ];
    });
  };

  return (
    <>
      {showMetrics && (
        <Dialog
          open={viewQueueMetrics}
          onOpenChange={(open) => {
            if (!open) {
              setViewQueueMetrics(false);
            }
          }}
        >
          <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
            <DialogHeader>
              <DialogTitle>Queue Metrics</DialogTitle>
            </DialogHeader>
            <Separator />
            {tenantMetricsQuery.data?.queues && (
              <CodeHighlighter
                language="json"
                code={JSON.stringify(
                  tenantMetricsQuery.data?.queues || "{}",
                  null,
                  2,
                )}
              />
            )}
            {tenantMetricsQuery.isLoading && (
              <Skeleton className="w-full h-36" />
            )}
          </DialogContent>
        </Dialog>
      )}
      {!createdAfterProp && (
        <div className="flex flex-row justify-end items-center gap-2">
          {customTimeRange && [
            <Button
              key="clear"
              onClick={() => {
                setCustomTimeRange(undefined);
              }}
              variant="outline"
              size="sm"
              className="text-xs h-9 py-2"
            >
              <XCircleIcon className="h-[18px] w-[18px] mr-2" />
              Clear
            </Button>,
            <DateTimePicker
              key="after"
              label="After"
              date={createdAfter ? new Date(createdAfter) : undefined}
              setDate={(date) => {
                setCreatedAfter(date?.toISOString());
              }}
            />,
            <DateTimePicker
              key="before"
              label="Before"
              date={finishedBefore ? new Date(finishedBefore) : undefined}
              setDate={(date) => {
                setFinishedBefore(date?.toISOString());
              }}
            />,
          ]}
          <Select
            value={customTimeRange ? "custom" : defaultTimeRange}
            onValueChange={(value) => {
              if (value !== "custom") {
                setDefaultTimeRange(value);
                setCustomTimeRange(undefined);
              } else {
                setCustomTimeRange([
                  getCreatedAfterFromTimeRange(value) ||
                    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                  new Date().toISOString(),
                ]);
              }
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue id="timerange" placeholder="Choose time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="6h">6 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {showMetrics && cloudMeta && cloudMeta.data?.metricsEnabled && (
        <GetWorkflowChart
          tenantId={tenant.metadata.id}
          createdAfter={createdAfter}
          zoom={(createdAfter, createdBefore) => {
            setCustomTimeRange([createdAfter, createdBefore]);
          }}
          finishedBefore={finishedBefore}
          refetchInterval={refetchInterval}
        />
      )}
      <div className="flex flex-row justify-between items-center my-4">
        {metricsQuery.data ? (
          <WorkflowRunsMetricsView
            metrics={metricsQuery.data}
            onViewQueueMetricsClick={() => {
              setViewQueueMetrics(true);
            }}
            showQueueMetrics={showMetrics}
            onClick={(status) => {
              setColumnFilters((prev) => {
                let newFilters = prev;
                const statusFilter = prev.find(
                  (filter) => filter.id === "status",
                );
                if (statusFilter) {
                  newFilters = prev.filter((filter) => filter.id !== "status");
                }

                if (
                  JSON.stringify(statusFilter?.value) ===
                  JSON.stringify([status])
                ) {
                  return newFilters;
                }

                return [
                  ...newFilters,
                  {
                    id: "status",
                    value: [status],
                  },
                ];
              });
            }}
          />
        ) : (
          <Skeleton className="max-w-[800px] w-[40vw] h-8" />
        )}
      </div>
      <DataTable
        emptyState={<>No workflow runs found with the given filters.</>}
        error={workflowKeysError}
        isLoading={isLoading}
        columns={columns(onAdditionalMetadataClick)}
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

const GetWorkflowChart = ({
  tenantId,
  createdAfter,
  finishedBefore,
  refetchInterval,
  zoom,
}: {
  tenantId: string;
  createdAfter?: string;
  finishedBefore?: string;
  refetchInterval?: number;
  zoom: (startTime: string, endTime: string) => void;
}) => {
  const mtmapi = useMtmClient();
  // const workflowRunEventsMetricsQuery = useQuery({
  //   ...queries.cloud.workflowRunMetrics(tenantId, {
  //     createdAfter,
  //     finishedBefore,
  //   }),
  //   placeholderData: (prev) => prev,
  //   refetchInterval,
  // });
  const workflowRunEventsMetricsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/cloud/tenants/{tenant}/m",
    {},
    {
      placeholderData: (prev) => prev,
      refetchInterval,
    },
  );

  // /api/v1/cloud/tenants/${tenant}/runs-metrics
  if (workflowRunEventsMetricsQuery.isLoading) {
    return <Skeleton className="w-full h-36" />;
  }

  return (
    <div className="">
      <ZoomableChart
        kind="bar"
        data={
          workflowRunEventsMetricsQuery.data?.results?.map(
            (result): DataPoint<"SUCCEEDED" | "FAILED"> => ({
              date: result.time,
              SUCCEEDED: result.SUCCEEDED,
              FAILED: result.FAILED,
            }),
          ) || []
        }
        colors={{
          SUCCEEDED: "rgb(34 197 94 / 0.5)",
          FAILED: "hsl(var(--destructive))",
        }}
        zoom={zoom}
        showYAxis={false}
      />
    </div>
  );
};
