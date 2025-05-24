"use client";

import type { StepRunStatus, WorkflowRunStatus, JobRunStatus } from "mtmaiapi";
import { capitalize, cn } from "mtxuilib/lib/utils";
import { Badge } from "mtxuilib/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mtxuilib/ui/tooltip";

type RunStatusType =
  `${StepRunStatus | WorkflowRunStatus | JobRunStatus | "SCHEDULED"}`;

type RunStatusVariant = {
  text: string;
  variant: "inProgress" | "successful" | "failed" | "outline";
};

const RUN_STATUS_VARIANTS: Record<RunStatusType, RunStatusVariant> = {
  SUCCEEDED: {
    text: "成功",
    variant: "successful",
  },
  FAILED: {
    text: "失败",
    variant: "failed",
  },
  CANCELLED: {
    text: "已取消",
    variant: "failed",
  },
  CANCELLING: {
    text: "正取消",
    variant: "inProgress",
  },
  RUNNING: {
    text: "运行中",
    variant: "inProgress",
  },
  QUEUED: {
    text: "Queued",
    variant: "outline",
  },
  PENDING: {
    text: "Pending",
    variant: "outline",
  },
  PENDING_ASSIGNMENT: {
    text: "Pending",
    variant: "outline",
  },
  ASSIGNED: {
    text: "Assigned",
    variant: "inProgress",
  },
  SCHEDULED: {
    text: "Scheduled",
    variant: "outline",
  },
};

const RUN_STATUS_REASONS: Record<string, string> = {
  TIMED_OUT: "Runtime Timed Out",
  SCHEDULING_TIMED_OUT: "Scheduling Timed Out",
};

const RUN_STATUS_VARIANTS_REASON_OVERRIDES: Record<
  keyof typeof RUN_STATUS_REASONS,
  RunStatusVariant
> = {
  TIMED_OUT: {
    text: "Timed Out",
    variant: "failed",
  },
  SCHEDULING_TIMED_OUT: {
    text: "Timed Out",
    variant: "failed",
  },
};

// TIMED_OUT
// SCHEDULING_TIMED_OUT

export function RunStatus({
  status,
  reason,
  className,
}: {
  status: RunStatusType;
  reason?: string;
  className?: string;
}) {
  const { text, variant } = RUN_STATUS_VARIANTS[status];
  const { text: overrideText, variant: overrideVariant } =
    (reason && RUN_STATUS_VARIANTS_REASON_OVERRIDES[reason]) || {};

  const StatusBadge = () => (
    <Badge variant={overrideVariant || variant} className={className}>
      {capitalize(overrideText || text)}
    </Badge>
  );

  if (!reason) {
    return <StatusBadge />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <StatusBadge />
        </TooltipTrigger>
        <TooltipContent>{RUN_STATUS_REASONS[reason] || reason}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const indicatorVariants = {
  successful: "border-transparent rounded-full bg-green-500",
  failed: "border-transparent rounded-full bg-red-500",
  inProgress: "border-transparent rounded-full bg-yellow-500",
  outline: "border-transparent rounded-full bg-muted",
};

export function RunIndicator({
  status,
}: {
  status: RunStatusType;
  reason?: string;
}) {

  const a = RUN_STATUS_VARIANTS[status]
  if (!a) {
    console.log("获取 status 出错123", status);
    return null;
  }
  const variant = RUN_STATUS_VARIANTS[status].variant;

  return (
    <div
      className={cn(indicatorVariants[variant], "rounded-full h-[6px] w-[6px]")}
    />
  );
}
