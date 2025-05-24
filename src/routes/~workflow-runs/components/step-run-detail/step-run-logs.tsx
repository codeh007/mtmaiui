"use client";
import { useQuery } from "@tanstack/react-query";
import { logLineListOptions, type StepRun, StepRunStatus } from "mtmaiapi";
import { LoggingComponent } from "mtxuilib/mt/logs";

export function StepRunLogs({
  stepRun,
  readableId,
}: {
  stepRun: StepRun | undefined;
  readableId: string;
}) {
  const getLogsQuery = useQuery({
    ...logLineListOptions({
      path: {
        "step-run": stepRun!.metadata.id,
      },
    }),
    enabled: !!stepRun,
      refetchInterval: () => {
        if (stepRun?.status === StepRunStatus.RUNNING) {
          return 1000;
        }
        return 5000;
      },
  });

  return (
    <div className="my-4">
      <LoggingComponent
        logs={
          getLogsQuery.data?.rows?.map((row) => ({
            timestamp: row.createdAt,
            line: row.message,
            instance: readableId,
          })) || []
        }
        onTopReached={() => {}}
        onBottomReached={() => {}}
      />
    </div>
  );
}
