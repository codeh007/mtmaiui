"use client";

import { useMutation } from "@tanstack/react-query";
import { Download, Play, Save } from "lucide-react";
import { FlowNames, type ResourceFlowInput, workflowRunCreateMutation } from "mtmaiapi";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import { useToast } from "mtxuilib/ui/use-toast";
import { RootRoute } from "../../~__root";

interface ResourceHeaderProps {
  resId: string;
}
export function ResourceHeader({ resId }: ResourceHeaderProps) {
  const toast = useToast();
  const nav = RootRoute.useNavigate();
  const workflowRun = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (result) => {
      toast.toast({
        title: "运行成功",
        description: (
          <div>
            <Button
              onClick={() => {
                nav({ to: `/workflow-runs/${result.metadata?.id}` });
              }}
            >
              查看
            </Button>
          </div>
        ),
      });
    },
  });

  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {/* <CustomLink to={`/coms/${componentId}/view`}>组件</CustomLink> */}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>资源</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderActionConainer className="gap-2 flex text-xs rounded border-dashed items-center">
        <div className="flex items-center gap-2">
          {/* {validationResults && !validationResults.is_valid && (
              <div className="inline-block mr-2">
                <ValidationErrors validation={validationResults} />
              </div>
            )} */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                //   onClick={() => {
                //     const json = JSON.stringify(syncToJson(), null, 2);
                //     const blob = new Blob([json], {
                //       type: "application/json",
                //     });
                //     const url = URL.createObjectURL(blob);
                //     const a = document.createElement("a");
                //     a.href = url;
                //     a.download = "team-config.json";
                //     a.click();
                //     URL.revokeObjectURL(url);
                //   }}
              >
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Download Team</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline">
                <div className="relative">
                  <Save className="size-4" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Save Team</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <CustomLink
                to={`/session/${sessionId}/team_state`}
                search={search}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <Icons.code className="size-4" />
              </CustomLink> */}
            </TooltipTrigger>
            <TooltipContent>
              <span>state</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="default"
                onClick={() => {
                  workflowRun.mutate({
                    path: {
                      workflow: FlowNames.RESOURCE,
                    },
                    body: {
                      input: {
                        resource_id: resId,
                      } satisfies ResourceFlowInput,
                    },
                  });
                }}
              >
                <Play className="size-4" /> Run
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>运行</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </HeaderActionConainer>
    </DashHeaders>
  );
}
