"use client";

import { ArrowPathIcon, ArrowPathRoundedSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  type ReplayWorkflowRunsRequest,
  type WorkflowRunList,
  WorkflowRunOrderByDirection,
  WorkflowRunOrderByField,
  WorkflowRunStatus,
  type WorkflowRunsMetrics,
  tenantGetStepRunQueueMetricsOptions,
  workflowListOptions,
  workflowRunCancelMutation,
  workflowRunGetMetricsOptions,
  workflowRunListOptions,
} from "mtmaiapi";
import {
  type FilterOption,
  type ToolbarFilters,
  ToolbarType,
} from "mtxuilib/data-table/data-table-toolbar";
import { Button } from "mtxuilib/ui/button";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";
import type { AdditionalMetadataClick } from "../routes/~events/additional-metadata";
import { useMtmai } from "./MtmaiProvider";

export type ComponentsProps = {};

export interface ComponentsState extends ComponentsProps {
  isPending: boolean;
  viewQueueMetrics: boolean;
  setViewQueueMetrics: (viewQueueMetrics: boolean) => void;
  finishedBefore: string | undefined;
  setFinishedBefore: (finishedBefore: string) => void;
  createdAfter: string | undefined;
  setCreatedAfter: (createdAfter: string) => void;
  metricsQueryData: WorkflowRunsMetrics | undefined;
  setMetricsQueryData: (metricsQueryData) => void;
  tenantStepRunQueueMetrics: WorkflowRunsMetrics | undefined;
  setTenantStepRunQueueMetrics: (tenantStepRunQueueMetrics) => void;
  customTimeRange: string[] | undefined;
  setCustomTimeRange: (customTimeRange: string[]) => void;
  actions: React.ReactNode[];
  setActions: (actions: React.ReactNode[]) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
  columnVisibility: VisibilityState;
  setColumnVisibility: (columnVisibility: VisibilityState) => void;
  rowSelection: RowSelectionState;
  setRowSelection: (rowSelection: RowSelectionState) => void;
  rotate: boolean;
  setRotate: (rotate: boolean) => void;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  onAdditionalMetadataClick: ({ key, value }: AdditionalMetadataClick) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  listWorkflowRunsData: WorkflowRunList;
  // setListWorkflowRunsData: (listWorkflowRunsData) => void;
}

export const createWorkbrenchSlice: StateCreator<ComponentsState, [], [], ComponentsState> = (
  set,
  get,
  init,
) => {
  return {
    isPending: false,
    viewQueueMetrics: false,
    setViewQueueMetrics: (viewQueueMetrics: boolean) => {
      set({ viewQueueMetrics });
    },
    finishedBefore: undefined,
    setFinishedBefore: (finishedBefore: string) => {
      set({ finishedBefore });
    },
    setMetricsQueryData: (metricsQueryData) => {
      set({ metricsQueryData });
    },
    createdAfter: undefined,
    setCreatedAfter: (createdAfter: string) => {
      set({ createdAfter });
    },
    tenantStepRunQueueMetrics: undefined,
    setTenantStepRunQueueMetrics: (tenantStepRunQueueMetrics) => {
      set({ tenantStepRunQueueMetrics });
    },
    ...init,
  };
};

const createWorkflowRunStore = (initProps?: Partial<ComponentsState>) => {
  return createStore<ComponentsState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "workflow-run-store",
        },
      ),
    ),
  );
};
const componentsStoreContext = createContext<ReturnType<typeof createWorkflowRunStore> | null>(
  null,
);

export const WorkflowRunProvider = (props: React.PropsWithChildren<ComponentsProps>) => {
  const { children, ...etc } = props;
  const tid = useTenantId();
  const [isPending, startTransition] = useTransition();
  const {
    createdAfter,
    initColumnVisibility,
    showMetrics = true,
    viewType = "table",
    workflowId,
    parentWorkflowRunId,
    parentStepRunId,
    refetchInterval = 5000,
    filterVisibility = {},
    timeRangeParam,
    sort = "",
    filters = "[]",
    metadataFilter = [],
    pageIndex = 0,
    pageSize = 50,
    backTo = "/workflow-runs",
  } = useSearch();

  const [customTimeRange, setCustomTimeRange] = useState<string[] | undefined>(() => {
    // const timeRangeParam = search.get("customTimeRange");
    if (timeRangeParam) {
      return timeRangeParam?.split(",").map((param) => {
        return new Date(param).toISOString();
      });
    }
    return undefined;
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rotate, setRotate] = useState(false);

  const actions = [
    <Button
      disabled={!Object.values(rowSelection).some((selected) => !!selected)}
      key="cancel"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        cancelWorkflowRunMutation.mutate({
          path: {
            tenant: tid,
          },
          body: {
            workflowRunIds: selectedRuns?.map((run) => run.metadata.id),
          },
        });
      }}
      variant={"outline"}
      aria-label="Cancel Selected Runs"
    >
      <XMarkIcon className={"mr-2 h-4 w-4 transition-transform"} />
      取消
    </Button>,
    <Button
      disabled={!Object.values(rowSelection).some((selected) => !!selected)}
      key="replay"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        replayWorkflowRunsMutation.mutate({
          workflowRunIds: selectedRuns?.map((run) => run.metadata.id),
        });
      }}
      variant={"outline"}
      aria-label="Replay Selected Runs"
    >
      <ArrowPathRoundedSquareIcon className="mr-2 h-4 w-4 transition-transform" />
      重试
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
      <ArrowPathIcon className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`} />
    </Button>,
  ];

  const defaultTimeRange = useMtmai((x) => x.lastTimeRange);
  const setDefaultTimeRange = useMtmai((x) => x.setLastTimeRange);

  useEffect(() => {
    const interval = setInterval(() => {
      if (customTimeRange) {
        return;
      }

      // setCreatedAfter(
      //   getCreatedAfterFromTimeRange(defaultTimeRange) ||
      //     new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      // );
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [defaultTimeRange, customTimeRange]);

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sort) {
      return sort.split(",").map((param) => {
        const [id, desc] = param.split(":");
        return { id, desc: desc === "desc" };
      });
    }
    return [];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    // const filtersParam = search.get("filters");
    if (filters) {
      return JSON.parse(filters);
    }
    return [];
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initColumnVisibility);
  const [pagination, setPagination] = useState<PaginationState>(() => {
    // const pageIndex = Number(search.get("pageIndex")) || 0;
    // const pageSize = Number(search.get("pageSize")) || 50;
    return { pageIndex, pageSize };
  });
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
    // const filter = columnFilters.find((filter) => filter.id === "Metadata");

    // if (!filter) {
    //   return;
    // }

    // return filter?.value as Array<string>;
    // return [`componentId:${search.componentId}`];
    return metadataFilter;
  }, [metadataFilter]);
  const orderByDirection = useMemo((): WorkflowRunOrderByDirection | undefined => {
    if (!sorting.length) {
      return;
    }

    return sorting[0]?.desc ? WorkflowRunOrderByDirection.DESC : WorkflowRunOrderByDirection.ASC;
  }, [sorting]);
  const orderByField = useMemo((): WorkflowRunOrderByField | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "Duration":
        return WorkflowRunOrderByField.DURATION;
      case "Finished at":
        return WorkflowRunOrderByField.FINISHED_AT;
      case "Started at":
        return WorkflowRunOrderByField.STARTED_AT;
      case "Seen at":
        return WorkflowRunOrderByField.CREATED_AT;
      default:
        return WorkflowRunOrderByField.CREATED_AT;
    }
  }, [sorting]);
  const listWorkflowRunsQuery = useQuery({
    ...workflowRunListOptions({
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
        createdAfter,
        // finishedBefore: mystore.getState().finishedBefore,
      },
    }),
    placeholderData: (prev) => prev,
    refetchInterval,
  });

  const metricsQuery = useQuery({
    ...workflowRunGetMetricsOptions({
      path: {
        tenant: tid,
      },
      query: {
        workflowId: workflow,
        parentWorkflowRunId,
        parentStepRunId,
        additionalMetadata: AdditionalMetadataFilter,
        createdAfter,
      },
    }),
    refetchInterval,
    placeholderData: (prev) => prev,
  });

  const tenantMetricsQuery = useQuery({
    ...tenantGetStepRunQueueMetricsOptions({
      path: {
        tenant: tid,
      },
    }),
    refetchInterval,
    placeholderData: (prev) => prev,
  });
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

  const selectedRuns = useMemo(() => {
    return Object.entries(rowSelection)
      .filter(([, selected]) => !!selected)
      ?.map(([id]) => (listWorkflowRunsQuery.data?.rows || [])[Number(id)]);
  }, [listWorkflowRunsQuery.data?.rows, rowSelection]);

  // const tid = useTenantId();
  const cancelWorkflowRunMutation = useMutation({
    ...workflowRunCancelMutation(),
  });

  const replayWorkflowRunsMutation = useMutation({
    mutationKey: ["workflow-run:update:replay", tid],
    mutationFn: async (data: ReplayWorkflowRunsRequest) => {
      // await api.workflowRunUpdateReplay(tenant.metadata.id, data);
    },
    onSuccess: () => {
      setRowSelection({});

      // bit hacky, but workflow run statuses aren't updated immediately after replay
      setTimeout(() => {
        listWorkflowRunsQuery.refetch();
      }, 1000);
    },
    // onError: handleApiError,
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

  const toolbarFilters: ToolbarFilters = [
    // {
    //   columnId: "Workflow",
    //   title: "Workflow",
    //   options: workflowKeyFilters,
    //   type: ToolbarType.Radio,
    // },
    // {
    //   columnId: "status",
    //   title: "Status",
    //   options: workflowRunStatusFilters,
    // },
    {
      columnId: "Metadata",
      title: "Metadata",
      type: ToolbarType.KeyValue,
    },
  ].filter((filter) => filterVisibility[filter.columnId] !== false);

  const refetch = () => {
    listWorkflowRunsQuery.refetch();
    tenantMetricsQuery.refetch();
    metricsQuery.refetch();
  };

  const isLoading =
    listWorkflowRunsQuery.isFetching || workflowKeysIsLoading || metricsQuery.isLoading;

  const onAdditionalMetadataClick = ({ key, value }: AdditionalMetadataClick) => {
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(
    () =>
      createWorkflowRunStore({
        ...etc,
        customTimeRange,
        setCustomTimeRange,
        actions,
        onAdditionalMetadataClick,
        listWorkflowRunsData: listWorkflowRunsQuery.data,
      }),
    [listWorkflowRunsQuery.data],
  );
  useEffect(() => {
    if (customTimeRange && customTimeRange.length === 2) {
      mystore.getState().setCreatedAfter(customTimeRange[0]);
      mystore.getState().setFinishedBefore(customTimeRange[1]);
    } else if (defaultTimeRange) {
      // setCreatedAfter(getCreatedAfterFromTimeRange(defaultTimeRange));
      mystore.getState().setFinishedBefore(undefined);
    }
  }, [defaultTimeRange, customTimeRange]);
  return (
    <componentsStoreContext.Provider value={mystore}>{children}</componentsStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkflowRunStore(): ComponentsState;
export function useWorkflowRunStore<T>(selector: (state: ComponentsState) => T): T;
export function useWorkflowRunStore<T>(selector?: (state: ComponentsState) => T) {
  const store = useContext(componentsStoreContext);
  if (!store) throw new Error("useWorkflowRunStore must in WorkflowRunProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
