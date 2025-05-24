"use client";
import {
  ArrowLeftEndOnRectangleIcon,
  ServerStackIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import type { ColumnDef } from "@tanstack/react-table";
import { RelativeDate } from "mtxuilib/mt/relative-date";

import { useQuery } from "@tanstack/react-query";
import {
  type ApiResourceMeta,
  type Step,
  type StepRun,
  type StepRunEvent,
  StepRunEventReason,
  type StepRunEventSeverity,
  stepRunGetOptions,
  stepRunListArchivesOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "mtxuilib/ui/popover";
import { type useMemo, useRef, useState } from "react";

import StepRunError from "./step-run-detail/step-run-error";

export type ActivityEventData = {
  metadata: ApiResourceMeta;
  event: StepRunEvent;
  stepRun?: StepRun;
  step?: Step;
};

export const eventsColumns = ({
  onRowClick,
  allEvents,
}: {
  onRowClick?: (row: ActivityEventData) => void;
  allEvents: ActivityEventData[];
}): ColumnDef<ActivityEventData>[] => {
  const res: ColumnDef<ActivityEventData>[] = [];
  if (onRowClick) {
    res.push({
      accessorKey: "resource",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="任务" />
      ),
      cell: ({ row }) => {
        if (!row.original.stepRun) {
          // return null;
          return (
            <>
              <DebugValue title="缺少 stepRun" data={{ row: row.original }} />
            </>
          );
        }
        return (
          <div className="min-w-[120px] max-w-[180px]">
            <Badge
              className="cursor-pointer text-xs font-mono py-1 bg-[#ffffff] dark:bg-[#050c1c] border-[#050c1c] dark:border-gray-400"
              variant="outline"
              onClick={() => onRowClick(row.original)}
            >
              <ArrowLeftEndOnRectangleIcon className="size-4 mr-1" />
              <div className="truncate max-w-[150px]">
                {row.original.step?.readableId}
              </div>
            </Badge>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    });
  }
  res.push(
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="始于" />
      ),
      cell: ({ row }) => (
        <div className="w-fit min-w-[120px]">
          <RelativeDate date={row.original.event.timeFirstSeen} />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "event",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="事件" />
      ),
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex flex-row items-center gap-2">
            <EventIndicator severity={event.event.severity} />
            <div className="tracking-wide text-sm flex flex-row gap-4">
              {getTitleFromReason(event.event.reason, event.event.message)}
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="时长" />
      ),
      cell: ({ row }) => {
        const event = row.original.event;
        return (
          <div>
            <div className="text-xs text-muted-foreground font-mono tracking-tight">
              {row.original.event.message}
            </div>
            {event.reason === StepRunEventReason.FAILED && (
              <ErrorWithHoverCard event={row.original} rows={allEvents} />
            )}
            {(event.data?.worker_id as unknown as string) && (
              <div>
                <CustomLink to={`/workers/${event.data?.worker_id}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="font-mono text-xs text-muted-foreground tracking-tight brightness-150"
                  >
                    <ServerStackIcon className="size-4 mr-1" />
                    View Worker
                  </Button>
                </CustomLink>
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  );

  return res;
};

const REASON_TO_TITLE: Record<StepRunEventReason, string> = {
  [StepRunEventReason.ASSIGNED]: "Assigned to worker",
  [StepRunEventReason.STARTED]: "Started",
  [StepRunEventReason.FINISHED]: "Completed",
  [StepRunEventReason.FAILED]: "Failed",
  [StepRunEventReason.CANCELLED]: "Cancelled",
  [StepRunEventReason.RETRYING]: "Retrying",
  [StepRunEventReason.REQUEUED_NO_WORKER]: "Requeuing (no worker available)",
  [StepRunEventReason.REQUEUED_RATE_LIMIT]: "Requeuing (rate limit)",
  [StepRunEventReason.SCHEDULING_TIMED_OUT]: "Scheduling timed out",
  [StepRunEventReason.TIMEOUT_REFRESHED]: "Timeout refreshed",
  [StepRunEventReason.REASSIGNED]: "Reassigned",
  [StepRunEventReason.TIMED_OUT]: "Execution timed out",
  [StepRunEventReason.SLOT_RELEASED]: "Slot released",
  [StepRunEventReason.RETRIED_BY_USER]: "Replayed by user",
  [StepRunEventReason.WORKFLOW_RUN_GROUP_KEY_SUCCEEDED]:
    "Successfully got group key",
  [StepRunEventReason.WORKFLOW_RUN_GROUP_KEY_FAILED]: "Failed to get group key",
  [StepRunEventReason.ACKNOWLEDGED]: "Acknowledged by worker",
};

function getTitleFromReason(reason: StepRunEventReason, message: string) {
  return REASON_TO_TITLE[reason] || message;
}

const RUN_STATUS_VARIANTS: Record<StepRunEventSeverity, string> = {
  INFO: "border-transparent rounded-full bg-green-500",
  CRITICAL: "border-transparent rounded-full bg-red-500",
  WARNING: "border-transparent rounded-full bg-yellow-500",
};

function EventIndicator({ severity }: { severity: StepRunEventSeverity }) {
  return (
    <div
      className={cn(
        RUN_STATUS_VARIANTS[severity],
        "rounded-full h-[6px] w-[6px]",
      )}
    />
  );
}

function ErrorWithHoverCard({
  event,
  rows,
}: {
  event: ActivityEventData;
  rows: ActivityEventData[];
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // containerRef needed due to https://github.com/radix-ui/primitives/issues/1159#issuecomment-2105108943
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <Popover
        open={popoverOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPopoverOpen(false);
          }
        }}
      >
        <PopoverTrigger
          onClick={() => {
            if (popoverOpen) {
              return;
            }

            setPopoverOpen(true);
          }}
          className="cursor-pointer"
        >
          <CustomLink
            // variant="link"
            // size="xs"
            // TODO 需要需要修正 link 地址
            to={`/workflow-runs/${event.stepRun?.metadata.id}`}
            className="font-mono text-xs text-muted-foreground tracking-tight brightness-150"
          >
            <XCircleIcon className="size-4 mr-1" />
            View Error
          </CustomLink>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-fit p-0 bg-background border-none z-[80]"
          align="start"
          container={containerRef.current}
        >
          <ErrorHoverContents event={event} rows={rows} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ErrorHoverContents({
  event,
  rows,
}: {
  event: ActivityEventData;
  rows: ActivityEventData[];
}) {
  // We cannot call this component without stepRun being defined.
  const failureRows = rows.filter(
    (row) =>
      row.event.reason === StepRunEventReason.FAILED ||
      row.event.reason === StepRunEventReason.CANCELLED,
  );

  const latestFailure = failureRows[0];

  // If this is the latest failure, we use the step run to get the error message on hover. Otherwise,
  // we look in the archives.
  const isLatestFailure = latestFailure.event.id === event.event.id;
  const getStepRunQuery = useQuery({
    ...stepRunGetOptions({
      path: {
        "step-run": event.stepRun!.metadata.id,
        tenant: event.stepRun!.tenantId,
      },
    }),
    enabled: isLatestFailure,
  });
  const listStepRunArchiveQuery = useQuery({
    ...stepRunListArchivesOptions({
      path: {
        "step-run": event.stepRun!.metadata.id,
      },
    }),
    enabled: !isLatestFailure,
  });

  const errorString = useMemo(() => {
    if (isLatestFailure && !getStepRunQuery.data) {
      return "Loading...";
    }

    if (!isLatestFailure && !listStepRunArchiveQuery.data) {
      return "Loading...";
    }

    if (isLatestFailure) {
      return getStepRunQuery.data?.error || "No error message found";
    }

    const eventData = event.event.data;

    const hasRetryCount = Object.keys(eventData).includes("retry_count");

    if (hasRetryCount) {
      const eventRetryCount = eventData.retry_count;

      // Track down the correct archived step run. Step runs have both retries and replays, so we have to find the
      // matching retryCount, but make sure that we skip the replays correctly.
      const matchingRows = failureRows.filter((row) => {
        const data = row.event?.data;
        if (Object.keys(data).includes("retry_count")) {
          return (
            data.retry_count === eventRetryCount &&
            row.event.timeFirstSeen > event.event.timeFirstSeen
          );
        }
      });

      let numArchivesToSkip = matchingRows.length;

      // if the retry count of the most recent error is equal to the event's retry count, we need to skip 1
      // fewer.
      const latestFailureEventData = latestFailure.event.data;

      if (
        Object.keys(latestFailureEventData).includes("retry_count") &&
        latestFailureEventData?.retry_count === eventRetryCount
      ) {
        numArchivesToSkip -= 1;
      }

      // find the corresponding archive
      const matchingArchives = listStepRunArchiveQuery.data?.rows?.filter(
        (archivedStepRun) => {
          return archivedStepRun.retryCount === eventRetryCount;
        },
      );

      const archivedStepRun = matchingArchives?.[numArchivesToSkip];

      return archivedStepRun?.error || "No error message found";
    }

    return "No error message found";
  }, [
    event,
    getStepRunQuery,
    isLatestFailure,
    listStepRunArchiveQuery,
    failureRows,
    latestFailure.event.data,
  ]);

  return <StepRunError text={errorString} />;
}
