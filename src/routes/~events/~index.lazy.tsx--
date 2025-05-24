import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  type Event,
  EventOrderByDirection,
  EventOrderByField,
  type ReplayEventRequest,
  WorkflowRunStatus,
  eventGetOptions,
  eventListOptions,
  workflowListOptions,
  workflowRunListOptions,
} from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import {
  type FilterOption,
  ToolbarType,
} from "mtxuilib/data-table/data-table-toolbar";
import { CodeEditor } from "mtxuilib/mt/code-editor";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import { Separator } from "mtxuilib/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiX } from "react-icons/bi";
// import { useMtmMutation } from "../../hooks/mtmQuery";
import { useTenant, useTenantId } from "../../hooks/useAuth";
import { workflowRunsColumns } from "../~workflow-runs/components/workflow-runs-columns";
import { CreateEventForm } from "./create-event-form";
import { eventColumns } from "./event-columns";

export const Route = createLazyFileRoute("/events/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();

  return (
    <>
      <EventsTable />
    </>
  );
}

function EventsTable() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const searchParams = useSearchParams();
  const [rotate, setRotate] = useState(false);

  const [createEventFieldErrors, setCreateEventFieldErrors] = useState<
    Record<string, string>
  >({});
  const tenant = useTenant();
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  useEffect(() => {
    if (
      selectedEvent &&
      (!searchParams.get("event") ||
        searchParams.get("event") !== selectedEvent.metadata.id)
    ) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("event", selectedEvent.metadata.id);
      //   setSearchParams(newSearchParams);
    } else if (
      !selectedEvent &&
      searchParams.get("event") &&
      searchParams.get("event") !== ""
    ) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("event");
      //   setSearchParams(newSearchParams);
    }
  }, [selectedEvent, searchParams]);

  const [search, setSearch] = useState<string | undefined>(
    searchParams.get("search") || undefined,
  );
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      const [id, desc] = sortParam.split(":");
      return [{ id, desc: desc === "desc" }];
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    EventId: false,
  });

  const [pagination, setPagination] = useState<PaginationState>(() => {
    const pageIndex = Number(searchParams.get("pageIndex")) || 0;
    const pageSize = Number(searchParams.get("pageSize")) || 50;
    return { pageIndex, pageSize };
  });
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("pageSize")) || 50,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (search) {
      newSearchParams.set("search", search);
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set(
      "sort",
      sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    );
    newSearchParams.set("filters", JSON.stringify(columnFilters));
    newSearchParams.set("pageIndex", pagination.pageIndex.toString());
    newSearchParams.set("pageSize", pagination.pageSize.toString());
    // setSearchParams(newSearchParams);
  }, [
    search,
    sorting,
    columnFilters,
    pagination,
    // setSearchParams,
    searchParams,
  ]);

  const orderByDirection = useMemo((): EventOrderByDirection | undefined => {
    if (!sorting.length) {
      return;
    }

    return sorting[0]?.desc
      ? EventOrderByDirection.DESC
      : EventOrderByDirection.ASC;
  }, [sorting]);

  const orderByField = useMemo((): EventOrderByField | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      // case "Seen at":
      default:
        return EventOrderByField.CREATED_AT;
    }
  }, [sorting]);

  const keys = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "key");

    if (!filter) {
      return;
    }

    return filter?.value as Array<string>;
  }, [columnFilters]);

  const workflows = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "workflows");

    if (!filter) {
      return;
    }

    return filter?.value as Array<string>;
  }, [columnFilters]);

  const statuses = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "status");

    if (!filter) {
      return;
    }

    return filter?.value as Array<WorkflowRunStatus>;
  }, [columnFilters]);

  const eventIds = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "EventId");

    if (!filter) {
      return;
    }

    return filter?.value as Array<string>;
  }, [columnFilters]);

  const AdditionalMetadataFilter = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "Metadata");

    if (!filter) {
      return;
    }

    return filter?.value as Array<string>;
  }, [columnFilters]);

  const offset = useMemo(() => {
    if (!pagination) {
      return;
    }

    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);

  const {
    data,
    isLoading: eventsIsLoading,
    refetch,
    error: eventsError,
  } = useQuery({
    ...eventListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
      query: {
        keys,
        workflows,
        orderByField,
        orderByDirection,
        offset,
        limit: pageSize,
        search,
        statuses,
        additionalMetadata: AdditionalMetadataFilter,
        eventIds: eventIds,
      },
    }),
    refetchInterval: 2000,
  });

  const cancelEventsMutation = useMutation({
    mutationKey: ["event:update:cancel", tenant.metadata.id],
    mutationFn: async (data: ReplayEventRequest) => {
      // await api.eventUpdateCancel(tenant.metadata.id, data);
    },
    onSuccess: () => {
      refetch();
    },
    // onError: handleApiError,
  });

  const replayEventsMutation = useMutation({
    mutationKey: ["event:update:replay", tenant.metadata.id],
    mutationFn: async (data: ReplayEventRequest) => {
      // await api.eventUpdateReplay(tenant!.metadata.id, data);
    },
    onSuccess: () => {
      refetch();
    },
    // onError: handleApiError,
  });
  // const createEventMutation = useMtmMutation(EventsService.method.push);

  const {
    data: eventKeys,
    isLoading: eventKeysIsLoading,
    error: eventKeysError,
  } = useQuery({
    ...eventListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });

  const eventKeyFilters = useMemo((): FilterOption[] => {
    return (
      eventKeys?.rows?.map((key) => ({
        value: key,
        label: key,
      })) || []
    );
  }, [eventKeys]);

  // const {
  //   data: workflowKeys,
  //   isLoading: workflowKeysIsLoading,
  //   error: workflowKeysError,
  // } = useQuery({
  //   ...queries.workflows.list(tenant.metadata.id, { limit: 200 }),
  // });

  const {
    data: workflowKeys,
    isLoading: workflowKeysIsLoading,
    error: workflowKeysError,
  } = useQuery({
    ...workflowListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
      query: {
        limit: 200,
      },
    }),
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
        value: WorkflowRunStatus.CANCELLED,
        label: "Cancelled",
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

  const tableColumns = eventColumns({
    onRowClick: (row: Event) => {
      setSelectedEvent(row);
    },
  });

  const actions = [
    <Button
      key="cancel"
      disabled={Object.keys(rowSelection).length === 0}
      variant={Object.keys(rowSelection).length === 0 ? "outline" : "default"}
      size="sm"
      className="h-8 px-2 lg:px-3 gap-2"
      onClick={() => {
        cancelEventsMutation.mutate({
          eventIds: Object.keys(rowSelection),
        });
      }}
    >
      <BiX className="h-4 w-4" />
      Cancel
    </Button>,
    <Button
      key="replay"
      disabled={Object.keys(rowSelection).length === 0}
      variant={Object.keys(rowSelection).length === 0 ? "outline" : "default"}
      size="sm"
      className="h-8 px-2 lg:px-3 gap-2"
      onClick={() => {
        replayEventsMutation.mutate({
          eventIds: Object.keys(rowSelection),
        });
      }}
    >
      <ArrowPathRoundedSquareIcon className="h-4 w-4" />
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
    <Button
      key="create-event"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        setShowCreateEvent(true);
      }}
      variant={"default"}
      aria-label="Create new event"
    >
      <PlusCircleIcon className="h-4 w-4" />
    </Button>,
  ];

  return (
    <>
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null);
          }
        }}
      >
        {selectedEvent && <ExpandedEventContent event={selectedEvent} />}
      </Dialog>
      <Dialog
        open={showCreateEvent}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateEvent(false);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Create a new event</DialogTitle>
        </DialogHeader>
        <CreateEventForm
          onSubmit={(data) => {
            console.log("createEventMutation.mutate", data);
            // createEventMutation.mutate({
            //   // path: {
            //   // tenant: tenant!.metadata.id,
            //   // },
            //   // body: data,
            //   ...data,
            // });
          }}
          // isLoading={createEventMutation.isPending}
          fieldErrors={createEventFieldErrors}
        />
      </Dialog>
      <DataTable
        error={eventsError || eventKeysError || workflowKeysError}
        isLoading={
          eventsIsLoading || eventKeysIsLoading || workflowKeysIsLoading
        }
        columns={tableColumns}
        data={data?.rows || []}
        filters={[
          {
            columnId: "key",
            title: "Key",
            options: eventKeyFilters,
          },
          {
            columnId: "workflows",
            title: "Workflow",
            options: workflowKeyFilters,
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
          {
            columnId: "EventId",
            title: "Event Id",
            type: ToolbarType.Array,
          },
        ]}
        showColumnToggle={true}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        actions={actions}
        sorting={sorting}
        setSorting={setSorting}
        search={search}
        setSearch={setSearch}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        pagination={pagination}
        setPagination={setPagination}
        onSetPageSize={setPageSize}
        pageCount={data?.pagination?.num_pages || 0}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        getRowId={(row) => row.metadata.id}
      />
    </>
  );
}

function ExpandedEventContent({ event }: { event: Event }) {
  return (
    <DialogContent className="w-fit max-w-[700px] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Event {event.key}</DialogTitle>
        <DialogDescription>
          Seen <RelativeDate date={event.metadata.createdAt} />
        </DialogDescription>
      </DialogHeader>

      <h3 className="text-lg font-bold leading-tight text-foreground">
        Event Data
      </h3>
      <Separator />
      <EventDataSection event={event} />
      <h3 className="text-lg font-bold leading-tight text-foreground">
        Workflow Runs
      </h3>
      <Separator />
      <EventWorkflowRunsList event={event} />
    </DialogContent>
  );
}

function EventDataSection({ event }: { event: Event }) {
  const getEventDataQuery = useQuery({
    ...eventGetOptions({
      path: {
        event: event.metadata.id,
      },
    }),
  });

  if (getEventDataQuery.isLoading || !getEventDataQuery.data) {
    return <MtLoading />;
  }

  const eventData = getEventDataQuery.data;

  return (
    <>
      <CodeEditor
        language="json"
        className="my-4"
        height="400px"
        code={JSON.stringify(eventData, null, 2)}
      />
    </>
  );
}

function EventWorkflowRunsList({ event }: { event: Event }) {
  const tid = useTenantId();
  const listWorkflowRunsQuery = useQuery({
    ...workflowRunListOptions({
      path: {
        tenant: tid,
      },
      query: {
        eventId: event.metadata.id,
        offset: 0,
        limit: 10,
      },
    }),
  });

  return (
    <div className="w-full overflow-x-auto max-w-full">
      <DataTable
        columns={workflowRunsColumns()}
        data={listWorkflowRunsQuery.data?.rows || []}
        filters={[]}
        pageCount={listWorkflowRunsQuery.data?.pagination?.num_pages || 0}
        columnVisibility={{
          "Triggered by": false,
        }}
        isLoading={listWorkflowRunsQuery.isLoading}
      />
    </div>
  );
}
