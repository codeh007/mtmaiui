"use client";
"use client";
import type React from "react";

import { formatDuration } from "date-fns";
import { type WorkflowRunShape, WorkflowRunStatus } from "mtmaiapi";
import { RelativeDate } from "mtxuilib/mt/relative-date";

export const RunSummary: React.FC<{ data: WorkflowRunShape }> = ({ data }) => {
  const timings: React.ReactNode[] = [];
  timings.push(
    <div key="created" className="text-sm text-muted-foreground">
      {"Created "}
      <RelativeDate date={data.metadata.createdAt} />
    </div>,
  );

  if (data.startedAt) {
    timings.push(
      <div key="started" className="text-sm text-muted-foreground">
        {"开始 "}
        <RelativeDate date={data.startedAt} />
      </div>,
    );
  } else {
    timings.push(
      <div key="running" className="text-sm text-muted-foreground">
        运行中
      </div>,
    );
  }

  if (data.status === WorkflowRunStatus.CANCELLED && data.finishedAt) {
    timings.push(
      <div key="cancelled" className="text-sm text-muted-foreground">
        已取消
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.status === WorkflowRunStatus.FAILED && data.finishedAt) {
    timings.push(
      <div key="failed" className="text-sm text-muted-foreground">
        失败
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.status === WorkflowRunStatus.SUCCEEDED && data.finishedAt) {
    timings.push(
      <div key="finished" className="text-sm text-muted-foreground">
        已完成
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.duration) {
    timings.push(
      <div key="duration" className="text-sm text-muted-foreground">
        耗时 {formatDuration(data.duration)}
      </div>,
    );
  }

  // interleave the timings with a dot
  const interleavedTimings: React.ReactNode[] = [];

  timings.forEach((timing, index) => {
    interleavedTimings.push(timing);
    if (index < timings.length - 1) {
      interleavedTimings.push(
        <div
          key={`dot-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          className="text-sm text-muted-foreground"
        >
          |
        </div>,
      );
    }
  });

  return (
    <div className="flex flex-row gap-4 items-center">{interleavedTimings}</div>
  );
};
