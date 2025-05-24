"use client";

import { Suspense } from "react";

import { ConfirmDialog } from "mtxuilib/mt/confirm-dialog";

import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import invariant from "tiny-invariant";

import { createLazyFileRoute } from "@tanstack/react-router";
import {
  type WorkflowUpdateRequest,
  workflowDeleteMutation,
  workflowGetOptions,
  workflowVersionGetOptions,
} from "mtmaiapi";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { relativeDate } from "mtxuilib/lib/utils";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { Badge } from "mtxuilib/ui/badge";
import { Button } from "mtxuilib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { Separator } from "mtxuilib/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { RootRoute } from "../../~__root";
import { WorkflowTriggerBtn } from "../WorkflowTriggerBtn";
import WorkflowGeneralSettings from "../components/workflow-general-settings";
import { WorkflowTags } from "../components/workflow-tags";
export const Route = createLazyFileRoute("/workflows/$workflowId/")({
  component: ExpandedWorkflow,
});

export default function ExpandedWorkflow() {
  const { workflowId } = Route.useParams();
  const nav = RootRoute.useNavigate();
  const [selectedVersion] = useState<string | undefined>();
  const [deleteWorkflow, setDeleteWorkflow] = useState(false);

  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflowId,
        // tenant: tenant!.metadata.id,
      },
    }),
  });

  // const workflowVersionQuery = mtmapi.useQuery(
  //   "get",
  //   "/api/v1/workflows/{workflow}/versions",
  //   {
  //     params: {
  //       path: {
  //         workflow: workflowId,
  //       },
  //       query: {
  //         version: selectedVersion,
  //       },
  //     },
  //   },
  //   {
  //     refetchInterval: 1000,
  //   },
  // );
  const workflowVersionQuery = useSuspenseQuery({
    ...workflowVersionGetOptions({
      path: {
        workflow: workflowId,
        // tenant: tenant!.metadata.id,
      },
      query: {
        version: selectedVersion,
      },
    }),
    refetchInterval: 3000,
  });

  const updateWorkflowMutation = useMutation({
    mutationKey: ["workflow:update", workflowQuery?.data?.metadata.id],
    mutationFn: async (data: WorkflowUpdateRequest) => {
      invariant(workflowQuery.data);
      console.log("workflowQuery.data", workflowQuery.data);
      // const res = await api.workflowUpdate(workflowQuery?.data?.metadata.id, {
      //   ...data,
      // });

      // return res.data;
    },
    // onError: handleApiError,
    onSuccess: () => {
      workflowQuery.refetch();
    },
  });
  const deleteWorkflowMutation = useMutation({
    ...workflowDeleteMutation(),
    onSuccess: () => {
      nav({ to: "/workflows" });
    },
  });

  const workflow = workflowQuery.data;

  // if (workflowQuery.isLoading || !workflow) {
  //   return <Loading />;
  // }

  // const hasGithubIntegration = integrations?.find((i) => i.name === "github");
  const currVersion = workflow.versions?.[0].version;

  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<SkeletonListview />}>
        <MtErrorBoundary>
          <div className="flex-grow h-full w-full">
            <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <Square3Stack3DIcon className="h-6 w-6 text-foreground mt-1" />
                  <h2 className="text-2xl font-bold leading-tight text-foreground">
                    {workflow.name}
                  </h2>
                  {currVersion && (
                    <Badge className="text-sm mt-1" variant="outline">
                      {currVersion}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {workflow.isPaused ? (
                        <Badge
                          variant="inProgress"
                          className="px-2"
                          onClick={() => {
                            updateWorkflowMutation.mutate({
                              isPaused: false,
                            });
                          }}
                        >
                          Paused
                        </Badge>
                      ) : (
                        <Badge
                          variant="successful"
                          className="px-2"
                          onClick={() => {
                            updateWorkflowMutation.mutate({
                              isPaused: true,
                            });
                          }}
                        >
                          Active
                        </Badge>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        {workflow.isPaused ? (
                          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                          <div
                            onClick={() => {
                              updateWorkflowMutation.mutate({
                                isPaused: false,
                              });
                            }}
                          >
                            Unpause runs
                          </div>
                        ) : (
                          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                          <div
                            onClick={() => {
                              updateWorkflowMutation.mutate({
                                isPaused: true,
                              });
                            }}
                          >
                            Pause runs
                          </div>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <WorkflowTags tags={workflow.tags || []} />
                <div className="flex flex-row gap-2">
                  <WorkflowTriggerBtn workflow={workflow} />
                </div>
              </div>
              <div className="flex flex-row justify-start items-center mt-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Updated {relativeDate(workflow.versions?.[0].metadata.updatedAt)}
                </div>
              </div>
              {workflow.description && (
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                  {workflow.description}
                </div>
              )}
              <div className="flex flex-row justify-start items-center mt-4" />
              <Tabs defaultValue="runs">
                <TabsList layout="underlined">
                  <TabsTrigger variant="underlined" value="runs">
                    Runs
                  </TabsTrigger>
                  <TabsTrigger variant="underlined" value="settings">
                    Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="runs">
                  <h3 className="text-xl font-bold leading-tight text-foreground mt-4">
                    Recent Runs
                  </h3>
                  <Separator className="my-4" />
                  <MtSuspenseBoundary>
                    <RecentRunsList workflowId={workflowId} />
                  </MtSuspenseBoundary>
                </TabsContent>
                <TabsContent value="settings">
                  <h3 className="text-xl font-bold leading-tight text-foreground mt-4">Settings</h3>
                  <Separator className="my-4" />
                  {workflowVersionQuery.isLoading || !workflowVersionQuery.data ? (
                    <MtLoading />
                  ) : (
                    <WorkflowGeneralSettings workflow={workflowVersionQuery.data} />
                  )}
                  {/* <Separator className="my-4" />
                  {hasGithubIntegration && (
                    <div className="hidden">
                      <h3 className="hidden text-xl font-bold leading-tight text-foreground mt-8">
                        Deployment Settings
                      </h3>
                      <Separator className="hidden my-4" />
                    </div>
                  )} */}
                  <h4 className="text-lg font-bold leading-tight text-foreground mt-8">
                    Danger Zone
                  </h4>
                  <Separator className="my-4" />
                  <Button
                    variant="destructive"
                    className="mt-2"
                    onClick={() => {
                      setDeleteWorkflow(true);
                    }}
                  >
                    Delete Workflow
                  </Button>

                  <ConfirmDialog
                    title={"Delete workflow"}
                    description={`Are you sure you want to delete the workflow ${workflow.name}? This action cannot be undone, and will immediately prevent any services running with this workflow from executing steps.`}
                    submitLabel={"Delete"}
                    onSubmit={(): void => {
                      deleteWorkflowMutation.mutate({
                        path: {
                          workflow: workflowId,
                          // tenant: tenant.metadata.id,
                        },
                      });
                    }}
                    onCancel={(): void => {
                      setDeleteWorkflow(false);
                    }}
                    isLoading={deleteWorkflowMutation.isPending}
                    isOpen={deleteWorkflow}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </MtErrorBoundary>
      </Suspense>
    </div>
  );
}

interface RecentRunsListProps {
  workflowId: string;
  // tenant: Tenant;
}
function RecentRunsList({ workflowId }: RecentRunsListProps) {
  return (
    <MtSuspenseBoundary>
      {/* <WorkflowRunsTable
        tenant={tenant}
        workflowId={workflowId}
        initColumnVisibility={{ Workflow: false }}
        filterVisibility={{ Workflow: false }}
      /> */}
      WorkflowRunsTable
    </MtSuspenseBoundary>
  );
}
