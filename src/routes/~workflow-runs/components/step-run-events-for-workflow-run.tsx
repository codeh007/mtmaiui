"use client";
import { useQuery } from "@tanstack/react-query";
import {
  type Step,
  type StepRun,
  type WorkflowRunShape,
  WorkflowRunStatus,
  workflowRunListStepRunEventsOptions,
} from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { useMemo } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { type ActivityEventData, eventsColumns } from "./events-columns";
export function StepRunEvents({
  workflowRun,
  filteredStepRunId,
  onClick,
}: {
  workflowRun: WorkflowRunShape;
  filteredStepRunId?: string;
  onClick?: (stepRunId?: string) => void;
}) {
  const tid = useTenantId();
  const eventsQuery = useQuery({
    ...workflowRunListStepRunEventsOptions({
      path: {
        tenant: tid,
        "workflow-run": workflowRun.metadata.id,
      },
    }),
    refetchInterval: () => {
      if (workflowRun.status === WorkflowRunStatus.RUNNING) {
        return 1000;
      }
      return 5000;
    },
  });

  const filteredEvents = useMemo(() => {
    if (!filteredStepRunId) {
      return eventsQuery.data?.rows || [];
    }

    return eventsQuery.data?.rows?.filter(
      (x) => x.stepRunId === filteredStepRunId,
    );
  }, [eventsQuery.data, filteredStepRunId]);

  const stepRuns = useMemo((): StepRun[] => {
    const a =
      workflowRun.jobRuns?.flatMap((jr) => jr.stepRuns).filter((x) => !!x) ||
      ([] as StepRun[] as StepRun[]);
    return a as StepRun[];
  }, [workflowRun]);

  const steps = useMemo(() => {
    const a =
      (
        workflowRun.jobRuns
          ?.flatMap((jr) => jr.job?.steps)
          .filter((x) => !!x) || ([] as Step[])
      ).flat() || ([] as Step[]);
    return a as Step[];
  }, [workflowRun]);

  const normalizedStepRunsByStepRunId = useMemo(() => {
    console.log("normalizedStepRunsByStepRunId", stepRuns);
    return stepRuns.reduce(
      (acc, stepRun) => {
        if (!stepRun) {
          return acc;
        }

        acc[stepRun.metadata.id] = stepRun;
        return acc;
      },
      {} as Record<string, StepRun>,
    );
  }, [stepRuns]);

  const normalizedStepsByStepRunId = useMemo(() => {
    return stepRuns.reduce(
      (acc, stepRun) => {
        if (!stepRun) {
          return acc;
        }

        const step = steps?.find((s) => s?.metadata.id === stepRun.stepId);
        if (step && stepRun) {
          acc[stepRun.metadata.id] = step;
        }
        return acc;
      },
      {} as Record<string, Step>,
    );
  }, [steps, stepRuns]);

  //合成数据,其中 重点是 stepRun 和 step
  const tableData: ActivityEventData[] =
    filteredEvents?.map((item) => {
      return {
        metadata: {
          id: `${item.id}`,
          createdAt: item.timeFirstSeen,
          updatedAt: item.timeLastSeen,
        },
        event: item,
        stepRun: item.stepRunId
          ? normalizedStepRunsByStepRunId[item.stepRunId]
          : undefined,
        step: item.stepRunId
          ? normalizedStepsByStepRunId[item.stepRunId]
          : undefined,
      };
    }) || [];

  const cols = eventsColumns({
    onRowClick: (row) => {
      console.log("eventsColumns onRowClick", row);
      onClick?.(row.stepRun?.metadata.id);
      // : undefined,
    },
    allEvents: tableData,
  });

  return (
    <>
      <DataTable
        emptyState={<>No events found.</>}
        isLoading={eventsQuery.isLoading}
        columns={cols}
        filters={[]}
        data={tableData}
      />
    </>
  );
}
