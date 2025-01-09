"use client";
import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDuration } from "date-fns";
import { PlayIcon } from "lucide-react";
import {
  type StepRun,
  stepRunGetSchemaOptions,
  type WorkflowRunShape,
} from "mtmaiapi";
import { StepRunStatus, queries } from "mtmaiapi/api";
import type { components } from "mtmaiapi/query_client/generated";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";
import { RelativeDate } from "mtxuilib/mt/relative-date";

import { MtLoading } from "mtxuilib/mt/mtloading";
import {
  MtTabs,
  MtTabsContent,
  MtTabsList,
  MtTabsTrigger,
} from "mtxuilib/mt/tabs";
import type React from "react";
import { useMemo, useState } from "react";
import { useTenant } from "../../../hooks/useAuth";
import { useMtmClient } from "../../../hooks/useMtmapi";
import { RunIndicator } from "../run-statuses";
import { StepRunEvents } from "../step-run-events-for-workflow-run";
import { WorkflowRunsTable } from "../workflow-runs-table";
import { StepRunLogs } from "./step-run-logs";
import StepRunOutput from "./step-run-output";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { useApiError } from "../../../hooks/useApi";
export enum TabOption {
  Output = "output",
  ChildWorkflowRuns = "child-workflow-runs",
  Input = "input",
  Logs = "logs",
  StepPlayground = "step-playground",
}

interface StepRunDetailProps {
  stepRunId: string;
  workflowRun: WorkflowRunShape;
  defaultOpenTab?: TabOption;
}

export const STEP_RUN_TERMINAL_STATUSES = [
  StepRunStatus.CANCELLING,
  StepRunStatus.CANCELLED,
  StepRunStatus.FAILED,
  StepRunStatus.SUCCEEDED,
];

const StepRunDetail: React.FC<StepRunDetailProps> = ({
  stepRunId,
  workflowRun,
  defaultOpenTab = TabOption.Output,
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const mtmapi = useMtmClient();
  const { handleApiError } = useApiError({
    setErrors,
  });

  const queryClient = useQueryClient();
  const getStepRunQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/step-runs/{step-run}",
    {
      params: {
        path: {
          tenant: workflowRun.tenantId,
          "step-run": stepRunId,
        },
      },
    },
    {
      refetchInterval: (query) => {
        const data = query.state.data;
        if (data?.status === StepRunStatus.RUNNING) {
          return 1000;
        }
        return 5000;
      },
    },
  );

  const stepRun = getStepRunQuery.data;

  const step = useMemo(() => {
    return workflowRun.jobRuns
      ?.flatMap((jr) => jr.job?.steps)
      .filter((x) => !!x)
      .find((x) => x?.metadata.id === stepRun?.stepId);
  }, [workflowRun, stepRun]);

  const rerunStepMutation = mtmapi.useMutation(
    "post",
    "/api/v1/tenants/{tenant}/step-runs/{step-run}/rerun",
    {
      onMutate: () => {
        setErrors([]);
      },
      onSuccess: (stepRun: StepRun) => {
        queryClient.invalidateQueries({
          queryKey: queries.workflowRuns.get(
            stepRun?.tenantId,
            workflowRun.metadata.id,
          ).queryKey,
        });
      },
      onError: handleApiError,
    },
  );

  const cancelStepMutation = mtmapi.useMutation(
    "post",
    "/api/v1/tenants/{tenant}/step-runs/{step-run}/cancel",
    {
      onMutate: () => {
        setErrors([]);
      },
      onSuccess: (stepRun: StepRun) => {
        queryClient.invalidateQueries({
          queryKey: queries.workflowRuns.get(
            stepRun?.tenantId,
            workflowRun.metadata.id,
          ).queryKey,
        });

        getStepRunQuery.refetch();
      },
      onError: handleApiError,
    },
  );

  const tenant = useTenant();
  const stepRunSchemaQuery = useQuery({
    ...stepRunGetSchemaOptions({
      path: {
        tenant: tenant.metadata.id,
        "step-run": stepRunId,
      },
    }),
  });

  if (!stepRun) {
    return <MtLoading />;
  }

  return (
    <div className="w-full h-screen overflow-y-scroll flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row gap-4 items-center">
            <RunIndicator status={stepRun.status} />
            <h3 className="text-lg font-mono font-semibold leading-tight tracking-tight text-foreground flex flex-row gap-4 items-center">
              {step?.readableId || "Step Run Detail"}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button
          size={"sm"}
          className="px-2 py-2 gap-2"
          variant={"outline"}
          disabled={!STEP_RUN_TERMINAL_STATUSES.includes(stepRun.status)}
          onClick={() => {
            if (!stepRun.input) {
              return;
            }

            let parsedInput: object;

            try {
              parsedInput = JSON.parse(stepRun.input);
            } catch (e) {
              return;
            }

            rerunStepMutation.mutate({
              params: {
                path: {
                  tenant: stepRun.tenantId,
                  "step-run": stepRun.metadata.id,
                },
              },
              body: {
                input: parsedInput as Record<string, never>,
              },
            });
          }}
        >
          <ArrowPathIcon className="w-4 h-4" />
          Replay
        </Button>
        <Button
          size={"sm"}
          className="px-2 py-2 gap-2"
          variant={"outline"}
          disabled={STEP_RUN_TERMINAL_STATUSES.includes(stepRun.status)}
          onClick={() => {
            cancelStepMutation.mutate({
              params: {
                path: {
                  tenant: stepRun.tenantId,
                  "step-run": stepRun.metadata.id,
                },
              },
            });
          }}
        >
          <XCircleIcon className="w-4 h-4" />
          Cancel
        </Button>
      </div>
      {errors && errors.length > 0 && (
        <div className="mt-4">
          {errors.map((error, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="text-red-500">
              {error}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-row gap-2 items-center">
        {stepRun && <StepRunSummary data={stepRun} />}
      </div>
      <MtTabs defaultValue={defaultOpenTab}>
        <MtTabsList layout="underlined">
          <MtTabsTrigger variant="underlined" value={TabOption.Output}>
            Output
          </MtTabsTrigger>
          {stepRun.childWorkflowRuns &&
            stepRun.childWorkflowRuns.length > 0 && (
              <MtTabsTrigger
                variant="underlined"
                value={TabOption.ChildWorkflowRuns}
              >
                Children ({stepRun.childWorkflowRuns.length})
              </MtTabsTrigger>
            )}
          <MtTabsTrigger variant="underlined" value={TabOption.Input}>
            Input
          </MtTabsTrigger>
          <MtTabsTrigger variant="underlined" value={TabOption.Logs}>
            Logs
          </MtTabsTrigger>
          <MtTabsTrigger variant="underlined" value={TabOption.StepPlayground}>
            input schema
          </MtTabsTrigger>
        </MtTabsList>
        <MtTabsContent value={TabOption.Output}>
          <StepRunOutput stepRun={stepRun} workflowRun={workflowRun} />
        </MtTabsContent>
        <MtTabsContent value={TabOption.ChildWorkflowRuns}>
          <ChildWorkflowRuns
            stepRun={stepRun}
            workflowRun={workflowRun}
            refetchInterval={5000}
          />
        </MtTabsContent>
        <MtTabsContent value={TabOption.Input}>
          {stepRun.input && (
            <CodeHighlighter
              className="my-4 h-[400px] max-h-[400px] overflow-y-auto"
              maxHeight="400px"
              minHeight="400px"
              language="json"
              code={JSON.stringify(JSON.parse(stepRun?.input || "{}"), null, 2)}
            />
          )}
        </MtTabsContent>
        <MtTabsContent value={TabOption.Logs}>
          <StepRunLogs
            stepRun={stepRun}
            readableId={step?.readableId || "step"}
          />
        </MtTabsContent>
        <MtTabsContent value={TabOption.StepPlayground}>
          <Button
            onClick={() => {
              stepRunSchemaQuery.refetch();
            }}
          >
            <PlayIcon className="w-4 h-4" />
          </Button>
        </MtTabsContent>

        {/* <TabsContent value="logs">App Logs</TabsContent> */}
      </MtTabs>
      <Separator className="my-4" />
      <div className="mb-8">
        <h3 className="text-lg font-semibold leading-tight text-foreground flex flex-row gap-4 items-center">
          Events
        </h3>
        <StepRunEvents
          workflowRun={workflowRun}
          filteredStepRunId={stepRunId}
        />
      </div>
    </div>
  );
};

export default StepRunDetail;

const StepRunSummary: React.FC<{ data: StepRun }> = ({ data }) => {
  const timings: JSX.Element[] = [];

  if (data.startedAt) {
    timings.push(
      <div key="created" className="text-sm text-muted-foreground">
        {"Started "}
        <RelativeDate date={data.startedAt} />
      </div>,
    );
  } else {
    timings.push(
      <div key="created" className="text-sm text-muted-foreground">
        Running
      </div>,
    );
  }

  if (data.status === StepRunStatus.CANCELLED && data.cancelledAt) {
    timings.push(
      <div key="finished" className="text-sm text-muted-foreground">
        {"Cancelled "}
        <RelativeDate date={data.cancelledAt} />
      </div>,
    );
  }

  if (data.status === StepRunStatus.FAILED && data.finishedAt) {
    timings.push(
      <div key="finished" className="text-sm text-muted-foreground">
        {"Failed "}
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.status === StepRunStatus.SUCCEEDED && data.finishedAt) {
    timings.push(
      <div key="finished" className="text-sm text-muted-foreground">
        {"Succeeded "}
        <RelativeDate date={data.finishedAt} />
      </div>,
    );
  }

  if (data.finishedAtEpoch && data.startedAtEpoch) {
    timings.push(
      <div key="duration" className="text-sm text-muted-foreground">
        Run took {formatDuration(data.finishedAtEpoch - data.startedAtEpoch)}
      </div>,
    );
  }

  // interleave the timings with a dot
  const interleavedTimings: JSX.Element[] = [];

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

export function ChildWorkflowRuns({
  stepRun,
  workflowRun,
  refetchInterval,
}: {
  stepRun: StepRun | undefined;
  workflowRun: components["schemas"]["WorkflowRun"];
  refetchInterval?: number;
}) {
  const tenant = useTenant();

  return (
    <WorkflowRunsTable
      parentWorkflowRunId={workflowRun.metadata.id}
      parentStepRunId={stepRun?.metadata.id}
      refetchInterval={refetchInterval}
      initColumnVisibility={{
        "Triggered by": false,
      }}
      createdAfter={stepRun?.metadata.createdAt}
    />
  );
}
