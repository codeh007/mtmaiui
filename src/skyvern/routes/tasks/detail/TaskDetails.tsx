"use client";
import { CopyIcon, PlayIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetchToCurl from "fetch-to-curl";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { useBasePath } from "../../../../hooks/useBasePath";
import { queryClient } from "../../../api/QueryClient";
import { Status, type TaskApiResponse } from "../../../api/types";
import { taskIsFinalized } from "../../../api/utils";
import { StatusBadge } from "../../../components/StatusBadge";

import { cn, copyText } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "mtxuilib/ui/dialog";
import { Label } from "mtxuilib/ui/label";
import { toast } from "mtxuilib/ui/use-toast";
import { CodeEditor } from "../../workflows/components/CodeEditor";
import { useTaskQuery } from "./hooks/useTaskQuery";

function createTaskRequestObject(values: TaskApiResponse) {
  return {
    url: values.request.url,
    webhook_callback_url: values.request.webhook_callback_url,
    navigation_goal: values.request.navigation_goal,
    data_extraction_goal: values.request.data_extraction_goal,
    proxy_location: values.request.proxy_location,
    error_code_mapping: values.request.error_code_mapping,
    navigation_payload: values.request.navigation_payload,
    extracted_information_schema: values.request.extracted_information_schema,
  };
}

interface TaskDetailsProps {
  taskId: string;
}
export function TaskDetails({
  taskId,
  children,
}: PropsWithChildren<TaskDetailsProps>) {
  // const query = useSuspenseQuery({
  //   ...getTaskOptions({ path: { task_id: taskId } }),
  // });
  // const task = query.data;

  // const workflowQuery = useSuspenseQuery({
  // 	...getWorkflowOptions({
  // 		path: {
  // 			workflow_permanent_id: task.workflow_run_id as string,
  // 		},
  // 	}),
  // });
  // const workflow = workflowQuery.data;

  const {
    data: task,
    isLoading: taskIsLoading,
    isError: taskIsError,
    error: taskError,
  } = useTaskQuery({ id: taskId });
  const { data: workflowRun, isLoading: workflowRunIsLoading } = useQuery({
    // queryKey: ["workflowRun", task?.workflow_run_id],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   return client
    //     .get(`/workflows/runs/${task?.workflow_run_id}`)
    //     .then((response) => response.data);
    // },
    ...getWorkflowRunOptions({
      path: {
        workflow_run_id: task?.workflow_run_id as string,
      },
    }),
    enabled: !!task?.workflow_run_id,
  });

  const { data: workflow, isLoading: workflowIsLoading } = useQuery({
    // queryKey: ["workflow", workflowRun?.workflow_id],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   return client
    //     .get(`/workflows/${workflowRun?.workflow_id}`)
    //     .then((response) => response.data);
    // },
    ...getWorkflowOptions({
      path: {
        workflow_permanent_id: workflowRun?.workflow_id,
      },
    }),
    enabled: !!workflowRun?.workflow_id,
  });

  // if (!task.workflow_run_id) {
  // 	throw new Error("Workflow run ID is required");
  // }

  // const workflowRunQuery = useSuspenseQuery({
  // 	...getWorkflowRunOptions({
  // 		path: {
  // 			workflow_run_id: task.workflow_run_id as string,
  // 			workflow_id: workflow.workflow_id as string,
  // 		},
  // 	}),
  // });
  // const workflowRun = workflowRunQuery.data;

  const cancelTask = useMutation({
    ...cancelTaskMutation(),
    // mutationFn: async () => {
    // 	const client = await getClient(credentialGetter);
    // 	return client
    // 		.post(`/tasks/${taskId}/cancel`)
    // 		.then((response) => response.data);
    // },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      // 	queryKey: ["task", taskId],
      // });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      if (task?.workflow_run_id) {
        queryClient.invalidateQueries({
          queryKey: ["workflowRun", task.workflow_run_id],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "workflowRun",
            workflow?.workflow_permanent_id,
            task.workflow_run_id,
          ],
        });
      }
      toast({
        variant: "success",
        title: "Task Canceled",
        description: "The task has been successfully canceled.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const showExtractedInformation =
    task?.status === Status.Completed && task.extracted_information !== null;
  const extractedInformation = showExtractedInformation ? (
    <div className="space-y-1">
      <Label className="text-lg">Extracted Information</Label>
      <CodeEditor
        language="json"
        value={JSON.stringify(task.extracted_information, null, 2)}
        readOnly
        minHeight={"96px"}
        maxHeight={"500px"}
        className="w-full"
      />
    </div>
  ) : null;

  const taskIsRunningOrQueued =
    task?.status === Status.Running || task?.status === Status.Queued;

  const taskHasTerminalState = task && taskIsFinalized(task);

  const showFailureReason =
    task?.status === Status.Failed ||
    task?.status === Status.Terminated ||
    task?.status === Status.TimedOut;
  const failureReason = showFailureReason ? (
    <div className="space-y-1">
      <Label className="text-lg">Failure Reason</Label>
      <CodeEditor
        language="json"
        value={JSON.stringify(task.failure_reason, null, 2)}
        readOnly
        minHeight={"96px"}
        maxHeight={"500px"}
        className="w-full"
      />
    </div>
  ) : null;

  const basePath = useBasePath();

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="text-3xl">{task?.task_id}</span>
            {task && <StatusBadge status={task.status} />}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (!task) {
                  return;
                }
                const curl = fetchToCurl({
                  method: "POST",
                  url: `${apiBaseUrl}/tasks`,
                  body: createTaskRequestObject(task),
                  headers: {
                    "Content-Type": "application/json",
                    // "x-api-key": apiCredential ?? "<your-api-key>",
                  },
                });
                copyText(curl).then(() => {
                  toast({
                    variant: "success",
                    title: "Copied to Clipboard",
                    description:
                      "The cURL command has been copied to your clipboard.",
                  });
                });
              }}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              cURL
            </Button>
            {taskIsRunningOrQueued && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Cancel</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this task?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Back</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        cancelTask.mutate({
                          path: {
                            task_id: task.task_id as string,
                          },
                        });
                      }}
                      disabled={cancelTask.isPending}
                    >
                      {cancelTask.isPending && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Cancel Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {taskHasTerminalState && (
              <Button asChild>
                <Link href={`${basePath}/create/retry/${task.task_id}`}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  重试
                </Link>
              </Button>
            )}
          </div>
        </div>
        {/* <div className="text-2xl text-slate-400 underline underline-offset-4">
          <WorkflowView
            workflow_permanent_id={task.workflow_run_id}
            task_id={task.task_id}
          />
          {workflowIsLoading || workflowRunIsLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            workflow &&
            task?.workflow_run_id && (
              <FlowRunLink
                workflow_run_id={task.workflow_run_id}
                workflow_id={workflow.workflow_permanent_id}
              />
            )
          )}
        </div> */}
      </header>
      {extractedInformation}
      {failureReason}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded border bg-muted p-1">
          <Link
            href={`${basePath}/tasks/${taskId}/actions`}
            className={cn(
              "cursor-pointer rounded-md px-2 py-1 text-muted-foreground",
              {
                // "bg-primary-foreground text-foreground": isActive,
              },
            )}
          >
            动作
          </Link>
          <Link
            href="recording"
            className={cn(
              "cursor-pointer rounded-md px-2 py-1 text-muted-foreground",
              {
                // "bg-primary-foreground text-foreground": isActive,
              },
            )}
          >
            录屏
          </Link>
          <Link
            href={`${basePath}/tasks/${taskId}/parameters`}
            className={cn(
              "cursor-pointer rounded-md px-2 py-1 text-muted-foreground",
              {
                // "bg-primary-foreground text-foreground": isActive,
              },
            )}
          >
            参数
          </Link>
          <Link
            href={`${basePath}/tasks/${taskId}/diagnostics`}
            className={cn(
              "cursor-pointer rounded-md px-2 py-1 text-muted-foreground",
              {
                // "bg-primary-foreground text-foreground": isActive,
              },
            )}
          >
            诊断
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
