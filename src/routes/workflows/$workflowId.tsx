"use client";

import {
  MtTabs,
  MtTabsContent,
  MtTabsList,
  MtTabsTrigger,
} from "mtxuilib/mt/tabs";
import { Suspense } from "react";

import { ConfirmDialog } from "mtxuilib/mt/confirm-dialog";

import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import api, { type WorkflowUpdateRequest } from "mtmaiapi/api";
import { use, useState } from "react";
import invariant from "tiny-invariant";

import { createFileRoute } from "@tanstack/react-router";
import {
  workflowDeleteMutation,
  workflowGetOptions,
  workflowVersionGetOptions,
} from "mtmaiapi";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { useMtRouter } from "mtxuilib/hooks/use-router";
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
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { WorkflowTriggerBtn } from "../../components/workflow/WorkflowTriggerBtn";
import WorkflowGeneralSettings from "../../components/workflow/workflow-general-settings";
import { WorkflowTags } from "../../components/workflow/workflow-tags";
import { useTenant } from "../../hooks";
import { useApiError, useApiMetaIntegrations } from "../../hooks/useApi";
import { useBasePath } from "../../hooks/useBasePath";
import { WorkflowRunsTable } from "../../modules/workflow-run/workflow-runs-table";
import { DashSidebar } from "../../components/sidebar/siderbar";
export const Route = createFileRoute("/workflows/$workflowId")({
  component: ExpandedWorkflow,
});

export default function ExpandedWorkflow(props: {
  params: Promise<{
    workflowId: string;
  }>;
}) {
  const { workflowId } = use(props.params);
  const tenant = useTenant();
  const router = useMtRouter();
  const basePath = useBasePath();
  // const mtmapi = useMtmClient();

  // TODO list previous versions and make selectable
  const [selectedVersion] = useState<string | undefined>();
  const { handleApiError } = useApiError({});
  const [deleteWorkflow, setDeleteWorkflow] = useState(false);

  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflowId,
        tenant: tenant.metadata.id,
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
        tenant: tenant.metadata.id,
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
      const res = await api.workflowUpdate(workflowQuery?.data?.metadata.id, {
        ...data,
      });

      return res.data;
    },
    onError: handleApiError,
    onSuccess: () => {
      workflowQuery.refetch();
    },
  });
  const deleteWorkflowMutation = useMutation({
    ...workflowDeleteMutation(),
    onSuccess: () => {
      router.push(`${basePath}/workflows`);
    },
  });

  const integrations = useApiMetaIntegrations();

  const workflow = workflowQuery.data;

  // if (workflowQuery.isLoading || !workflow) {
  //   return <Loading />;
  // }

  const hasGithubIntegration = integrations?.find((i) => i.name === "github");
  const currVersion = workflow.versions?.[0].version;

  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Workflows</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
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
                      <WorkflowTriggerBtn workflowId={workflowId} />
                    </div>
                  </div>
                  <div className="flex flex-row justify-start items-center mt-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Updated{" "}
                      {relativeDate(workflow.versions?.[0].metadata.updatedAt)}
                    </div>
                  </div>
                  {workflow.description && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                      {workflow.description}
                    </div>
                  )}
                  <div className="flex flex-row justify-start items-center mt-4" />
                  <MtTabs defaultValue="runs">
                    <MtTabsList layout="underlined">
                      <MtTabsTrigger variant="underlined" value="runs">
                        Runs
                      </MtTabsTrigger>
                      <MtTabsTrigger variant="underlined" value="settings">
                        Settings
                      </MtTabsTrigger>
                    </MtTabsList>
                    <MtTabsContent value="runs">
                      <h3 className="text-xl font-bold leading-tight text-foreground mt-4">
                        Recent Runs
                      </h3>
                      <Separator className="my-4" />
                      <MtSuspenseBoundary>
                        <RecentRunsList workflowId={workflowId} />
                      </MtSuspenseBoundary>
                    </MtTabsContent>
                    <MtTabsContent value="settings">
                      <h3 className="text-xl font-bold leading-tight text-foreground mt-4">
                        Settings
                      </h3>
                      <Separator className="my-4" />
                      {workflowVersionQuery.isLoading ||
                      !workflowVersionQuery.data ? (
                        <MtLoading />
                      ) : (
                        <WorkflowGeneralSettings
                          workflow={workflowVersionQuery.data}
                        />
                      )}
                      <Separator className="my-4" />
                      {hasGithubIntegration && (
                        <div className="hidden">
                          <h3 className="hidden text-xl font-bold leading-tight text-foreground mt-8">
                            Deployment Settings
                          </h3>
                          <Separator className="hidden my-4" />
                        </div>
                      )}
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
                            // params: {
                            path: {
                              workflow: workflowId,
                              tenant: tenant.metadata.id,
                            },
                            // },
                          });
                        }}
                        onCancel={(): void => {
                          setDeleteWorkflow(false);
                        }}
                        isLoading={deleteWorkflowMutation.isPending}
                        isOpen={deleteWorkflow}
                      />
                    </MtTabsContent>
                  </MtTabs>
                </div>
              </div>
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}

function RecentRunsList(props: { workflowId: string }) {
  // const tenant = useTenant();

  return (
    <>
      <WorkflowRunsTable
        workflowId={props.workflowId}
        initColumnVisibility={{ Workflow: false }}
        filterVisibility={{ Workflow: false }}
      />
    </>
  );
}
