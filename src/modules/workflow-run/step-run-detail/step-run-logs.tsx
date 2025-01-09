"use client";
import { type StepRun, StepRunStatus } from "mtmaiapi/api";
import { useMtmClient } from "../../../hooks/useMtmapi";
import { LoggingComponent } from "mtxuilib/mt/logs";

export function StepRunLogs({
  stepRun,
  readableId,
}: {
  stepRun: StepRun | undefined;
  readableId: string;
}) {
  const mtmapi = useMtmClient();
  const getLogsQuery = mtmapi.useQuery(
    "get",
    "/api/v1/step-runs/{step-run}/logs",
    {
      params: {
        path: {
          "step-run": stepRun!.metadata.id,
        },
        query: {
          orderByDirection: "asc",
        },
      },
    },
    {
      enabled: !!stepRun,
      refetchInterval: () => {
        if (stepRun?.status === StepRunStatus.RUNNING) {
          return 1000;
        }
        return 5000;
      },
    },
  );

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
