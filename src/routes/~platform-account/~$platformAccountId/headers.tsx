"use client";

import { useMutation } from "@tanstack/react-query";
import { Download, Play, Save } from "lucide-react";
import {
  FlowNames,
  type PlatformAccountFlowInput,
  workflowRunCreateMutation,
} from "mtmaiapi";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import { useTenantId } from "../../../hooks/useAuth";

interface PlatformAccountDetailHeaderProps {
  id: string;
}
export function PlatformAccountDetailHeader({
  id,
}: PlatformAccountDetailHeaderProps) {
  const tid = useTenantId();
  const workflowRun = useMutation({
    ...workflowRunCreateMutation(),
  });

  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink to={`${platformAccountId}`}>社媒账号</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          <BreadcrumbItem>
            <BreadcrumbPage>社媒账号</BreadcrumbPage>
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
              <Button size="icon" variant="outline">
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
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <CustomLink
                to={`/session/${sessionId}/team_state`}
                search={search}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <Icons.code className="size-4" />
              </CustomLink>
            </TooltipTrigger>
            <TooltipContent>
              <span>state</span>
            </TooltipContent>
          </Tooltip> */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="default"
                onClick={() => {
                  workflowRun.mutate({
                    path: {
                      workflow: FlowNames.PLATFORM_ACCOUNT,
                    },
                    body: {
                      input: {
                        type: "PlatformAccountFlowInput",
                        platform_account_id: id,
                      } satisfies PlatformAccountFlowInput,
                    },
                  });
                }}
              >
                <Play className="size-4" />
                Run
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
