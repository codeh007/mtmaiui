"use client";
import {
  ExclamationTriangleIcon,
  Pencil2Icon,
  PlayIcon,
  PlusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { stringify as convertToYAML } from "yaml";
import { useBasePath } from "../../../hooks/useBasePath";
import type { WorkflowRunApiResponse } from "../../api/types";
import { StatusBadge } from "../../components/StatusBadge";

import { client } from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { basicTimeFormat, cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "mtxuilib/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mtxuilib/ui/tooltip";
import { ImportWorkflowButton } from "./ImportWorkflowButton";
import { WorkflowActions } from "./WorkflowActions";
import { WorkflowTitle } from "./WorkflowTitle";
import type { WorkflowCreateYAMLRequest } from "./types/workflowYamlTypes";

const emptyWorkflowRequest: WorkflowCreateYAMLRequest = {
  title: "New Workflow",
  description: "",
  workflow_definition: {
    blocks: [],
    parameters: [],
  },
};

export function Workflows() {
  const router = useMtRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workflowsPage = searchParams.get("workflowsPage")
    ? Number(searchParams.get("workflowsPage"))
    : 1;
  const workflowRunsPage = searchParams.get("workflowRunsPage")
    ? Number(searchParams.get("workflowRunsPage"))
    : 1;

  // const { data: workflows, isLoading } = useQuery<Array<WorkflowApiResponse>>({
  // 	queryKey: ["workflows", workflowsPage],
  // 	queryFn: async () => {
  // 		// const client = await getClient(credentialGetter);
  // 		const params = new URLSearchParams();
  // 		params.append("page", String(workflowsPage));
  // 		params.append("only_workflows", "true");
  // 		return client
  // 			.get("/dashboard/workflows", {
  // 				params,
  // 			})
  // 			.then((response) => response.data);
  // 	},
  // });

  // const workflowsQuery = useSuspenseQuery({
  //   ...getWorkflowsOptions({
  //     query: {
  //       page: workflowsPage,
  //       only_workflows: true,
  //     },
  //   }),
  // });

  // const workflows = workflowsQuery.data;

  const { data: workflowRuns, isLoading: workflowRunsIsLoading } = useQuery<
    Array<WorkflowRunApiResponse>
  >({
    queryKey: ["workflowRuns", workflowRunsPage],
    queryFn: async () => {
      // const client = await getClient(credentialGetter);
      const params = new URLSearchParams();
      params.append("page", String(workflowRunsPage));
      return client
        .get("/workflows/runs", {
          params,
        })
        .then((response) => response.data);
    },
  });
  const basePath = useBasePath();
  const createNewWorkflowMutation = useMutation({
    // mutationFn: async () => {

    //   return client.post<
    //     typeof emptyWorkflowRequest,
    //     { data: WorkflowApiResponse }
    //   >("/workflows", yaml, {
    //     headers: {
    //       "Content-Type": "text/plain",
    //     },
    //   });
    // },
    ...createWorkflowMutation(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
      router.push(
        `${basePath}/workflows/${response.workflow_permanent_id}/edit`,
      );
    },
  });

  function handleRowClick(
    event: React.MouseEvent<HTMLTableCellElement>,
    workflowPermanentId: string,
  ) {
    if (event.ctrlKey || event.metaKey) {
      window.open(
        `${window.location.origin}/workflows/${workflowPermanentId}/runs`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    router.push(`${basePath}/workflows/${workflowPermanentId}/runs`);
  }

  function handleIconClick(
    event: React.MouseEvent<HTMLButtonElement>,
    path: string,
  ) {
    if (event.ctrlKey || event.metaKey) {
      window.open(
        window.location.origin + path,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    router.push(path);
  }

  const showExperimentalMessage =
    workflows?.length === 0 && workflowsPage === 1;

  return (
    <div className="space-y-8">
      {showExperimentalMessage && (
        <Alert variant="default" className="bg-slate-elevation2">
          <AlertTitle>
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <span className="text-xl">(功能未完善-处于内测状态)</span>
            </div>
          </AlertTitle>
          <AlertDescription className="text-base text-slate-300">
            工作流组件目前处于内测状态，欢迎大家试用，并提出宝贵意见。
          </AlertDescription>
        </Alert>
      )}

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workflows</h1>
        <div className="flex gap-2">
          <ImportWorkflowButton />
          <Button
            disabled={createNewWorkflowMutation.isPending}
            onClick={() => {
              const yaml = convertToYAML(emptyWorkflowRequest);

              createNewWorkflowMutation.mutateAsync({
                body: {
                  yaml: yaml,
                },
              });
            }}
          >
            {createNewWorkflowMutation.isPending ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusIcon className="mr-2 h-4 w-4" />
            )}
            Create Workflow
          </Button>
        </div>
      </header>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">ID</TableHead>
              <TableHead className="w-1/3">Title</TableHead>
              <TableHead className="w-1/3">Created At</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No workflows found</TableCell>
              </TableRow>
            ) : (
              workflows?.map((workflow) => {
                return (
                  <TableRow
                    key={workflow.workflow_permanent_id}
                    className="cursor-pointer"
                  >
                    <TableCell
                      onClick={(event) => {
                        handleRowClick(event, workflow.workflow_permanent_id);
                      }}
                    >
                      {workflow.workflow_permanent_id}
                    </TableCell>
                    <TableCell
                      onClick={(event) => {
                        handleRowClick(event, workflow.workflow_permanent_id);
                      }}
                    >
                      {workflow.title}
                    </TableCell>
                    <TableCell
                      onClick={(event) => {
                        handleRowClick(event, workflow.workflow_permanent_id);
                      }}
                    >
                      {basicTimeFormat(workflow.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={(event) => {
                                  handleIconClick(
                                    event,
                                    `${basePath}/workflows/${workflow.workflow_permanent_id}/edit`,
                                  );
                                }}
                              >
                                <Pencil2Icon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Open in Editor</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={(event) => {
                                  handleIconClick(
                                    event,
                                    `${basePath}/workflows/${workflow.workflow_permanent_id}/run`,
                                  );
                                }}
                              >
                                <PlayIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Create New Run</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <WorkflowActions id={workflow.workflow_permanent_id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Pagination className="pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn({ "cursor-not-allowed": workflowsPage === 1 })}
                onClick={() => {
                  if (workflowsPage === 1) {
                    return;
                  }
                  const params = new URLSearchParams();
                  params.set(
                    "workflowsPage",
                    String(Math.max(1, workflowsPage - 1)),
                  );
                  setSearchParams(params, { replace: true });
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{workflowsPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("workflowsPage", String(workflowsPage + 1));
                  setSearchParams(params, { replace: true });
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <header>
        <h1 className="text-2xl font-semibold">Workflow Runs</h1>
      </header>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Workflow Run ID</TableHead>
              <TableHead className="w-1/5">Workflow ID</TableHead>
              <TableHead className="w-1/5">Workflow Title</TableHead>
              <TableHead className="w-1/5">Status</TableHead>
              <TableHead className="w-1/5">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflowRunsIsLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : workflowRuns?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No workflow runs found</TableCell>
              </TableRow>
            ) : (
              workflowRuns?.map((workflowRun) => {
                return (
                  <TableRow
                    key={workflowRun.workflow_run_id}
                    onClick={(event) => {
                      if (event.ctrlKey || event.metaKey) {
                        window.open(
                          `${window.location.origin}/workflows/${workflowRun.workflow_permanent_id}/${workflowRun.workflow_run_id}`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                        return;
                      }
                      router.push(
                        `${basePath}/workflows/${workflowRun.workflow_permanent_id}/${workflowRun.workflow_run_id}`,
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="w-1/5">
                      {workflowRun.workflow_run_id}
                    </TableCell>
                    <TableCell className="w-1/5">
                      {workflowRun.workflow_permanent_id}
                    </TableCell>
                    <TableCell className="w-1/5">
                      <WorkflowTitle
                        workflowPermanentId={workflowRun.workflow_permanent_id}
                      />
                    </TableCell>
                    <TableCell className="w-1/5">
                      <StatusBadge status={workflowRun.status} />
                    </TableCell>
                    <TableCell className="w-1/5">
                      {basicTimeFormat(workflowRun.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Pagination className="pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn({ "cursor-not-allowed": workflowRunsPage === 1 })}
                onClick={() => {
                  if (workflowRunsPage === 1) {
                    return;
                  }
                  const params = new URLSearchParams();
                  params.set(
                    "workflowRunsPage",
                    String(Math.max(1, workflowRunsPage - 1)),
                  );
                  setSearchParams(params, { replace: true });
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{workflowRunsPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("workflowRunsPage", String(workflowRunsPage + 1));
                  setSearchParams(params, { replace: true });
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
