"use client";
import type React from "react";

import CronPrettifier from "cronstrue";

import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  type WorkflowRunShape,
  WorkflowRunStatus,
  eventGetOptions,
  workflowRunCancelMutation,
  workflowRunGetOptions,
  workflowRunUpdateReplayMutation,
} from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { useTenant, useTenantId } from "../../../hooks/useAuth";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";

interface RunDetailHeaderProps {
  data?: WorkflowRunShape;
  loading?: boolean;
  refetch: () => void;
}

export const WORKFLOW_RUN_TERMINAL_STATUSES = [
  WorkflowRunStatus.CANCELLED,
  WorkflowRunStatus.FAILED,
  WorkflowRunStatus.SUCCEEDED,
];

export const RunDetailHeader: React.FC<RunDetailHeaderProps> = ({ data, loading }) => {
  const tenant = useTenant();
  const tid = useTenantId();

  const cancelWorkflowRunMutation = useMutation({
    ...workflowRunCancelMutation(),
  });
  const replayWorkflowRunsMutation = useMutation({
    ...workflowRunUpdateReplayMutation(),
  });

  const { workflowRunId } = useParams({});
  const { shape } = useWorkflowRunShape(workflowRunId);

  const additionalMetadata = shape.data?.additionalMetadata;
  const componentId = additionalMetadata?.componentId;

  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink to={`/coms/${componentId}/view`}>组件</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data?.displayName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-between items-center w-full">
            {/* <div>
              <h2 className="text-2xl font-bold leading-tight text-foreground flex flex-row gap-4 items-center">
                <AdjustmentsHorizontalIcon className="w-5 h-5 mt-1" />
                {data?.displayName}
              </h2>
            </div> */}
            <div className="flex flex-row gap-2 items-center">
              <Button
                size={"sm"}
                className="px-2 py-2 gap-2"
                variant={"outline"}
                disabled={!WORKFLOW_RUN_TERMINAL_STATUSES.includes(data.status)}
                onClick={() => {
                  replayWorkflowRunsMutation.mutate({
                    path: {
                      tenant: tenant!.metadata.id,
                    },

                    body: {
                      workflowRunIds: [data.metadata.id],
                    },
                  });
                }}
              >
                <ArrowPathIcon className="size-4" />
                重试
              </Button>
              <Button
                size={"sm"}
                className="px-2 py-2 gap-2"
                variant={"outline"}
                disabled={WORKFLOW_RUN_TERMINAL_STATUSES.includes(data.status)}
                onClick={() => {
                  cancelWorkflowRunMutation.mutate({
                    path: {
                      tenant: tid,
                    },
                    body: {
                      workflowRunIds: [data.metadata.id],
                    },
                  });
                }}
              >
                <XCircleIcon className="size-4" />
                取消
              </Button>

              <Tabs defaultValue="activity">
                <TabsList layout="underlined">
                  <CustomLink to="">
                    <TabsTrigger variant="underlined" value="activity">
                      活动
                    </TabsTrigger>
                  </CustomLink>
                  <CustomLink to="input">
                    <TabsTrigger variant="underlined" value="input">
                      输入
                    </TabsTrigger>
                  </CustomLink>
                  <CustomLink to="additional-metadata">
                    <TabsTrigger variant="underlined" value="additional-metadata">
                      元数据
                    </TabsTrigger>
                  </CustomLink>
                  <TabsTrigger variant="underlined" value="control">
                    调试
                  </TabsTrigger>
                  <CustomLink to="visualization">
                    <TabsTrigger variant="underlined" value="visualization">
                      可视化
                    </TabsTrigger>
                  </CustomLink>
                  <CustomLink to="chat">
                    <TabsTrigger variant="underlined" value="agent_visualization">
                      交互
                    </TabsTrigger>
                  </CustomLink>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        {data.triggeredBy?.parentWorkflowRunId && (
          <TriggeringParentWorkflowRunSection
            tenantId={data.tenantId}
            parentWorkflowRunId={data.triggeredBy.parentWorkflowRunId}
          />
        )}
        {data.triggeredBy?.eventId && <TriggeringEventSection eventId={data.triggeredBy.eventId} />}
        {data.triggeredBy?.cronSchedule && (
          <TriggeringCronSection cron={data.triggeredBy.cronSchedule} />
        )}
      </div>
    </DashHeaders>
  );
};

function TriggeringParentWorkflowRunSection({
  tenantId,
  parentWorkflowRunId,
}: {
  tenantId: string;
  parentWorkflowRunId: string;
}) {
  const workflowRunQuery = useQuery({
    ...workflowRunGetOptions({
      path: {
        tenant: tenantId,
        "workflow-run": parentWorkflowRunId,
      },
    }),
  });

  if (workflowRunQuery.isLoading || !workflowRunQuery.data) {
    return null;
  }

  const workflowRun = workflowRunQuery.data;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-row gap-1">
      Triggered by
      <CustomLink
        to={`/workflow-runs/${parentWorkflowRunId}`}
        className="font-semibold hover:underline  text-indigo-500 dark:text-indigo-200"
      >
        {workflowRun.displayName} ➶
      </CustomLink>
    </div>
  );
}

function TriggeringEventSection({ eventId }: { eventId: string }) {
  const eventData = useQuery({
    ...eventGetOptions({
      path: {
        event: eventId,
      },
    }),
  });

  if (eventData.isLoading || !eventData.data) {
    return null;
  }

  const event = eventData.data;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-row gap-1">
      触发事件 {event.key}
    </div>
  );
}

function TriggeringCronSection({ cron }: { cron: string }) {
  const prettyInterval = `runs ${CronPrettifier.toString(cron).toLowerCase()} UTC`;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300">
      定时任务 {cron} 每 {prettyInterval}
    </div>
  );
}
