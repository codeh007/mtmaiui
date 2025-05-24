"use client";

import { InfoIcon, PlusIcon } from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { useSidebar } from "mtxuilib/ui/sidebar";
import { BetterTooltip } from "mtxuilib/ui/tooltip";
import { useWindowSize } from "usehooks-ts";
import { useSearch } from "../../hooks/useNav";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function SessionHeader() {
  const sessionId = useWorkbenchStore((x) => x.threadId);
  const search = useSearch();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);
  // const openChat = useWorkbenchStore((x) => x.openChat);

  const chatSessionId = useWorkbenchStore((x) => x.threadId);
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
            <BreadcrumbPage>对话</BreadcrumbPage>
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
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
              >
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Download Team</span>
            </TooltipContent>
          </Tooltip> */}
          {/* <BetterTooltip content="保存">
            <Button size="icon" variant="outline">
              <div className="relative">
                <Save className="size-4" />
              </div>
            </Button>
          </BetterTooltip> */}
          <BetterTooltip content="状态">
            <CustomLink
              to={`/session/${sessionId}/state`}
              search={search}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <InfoIcon className="size-4" />
            </CustomLink>
          </BetterTooltip>
          {(!open || windowWidth < 768) && (
            <BetterTooltip content="New Chat">
              <Button
                variant="ghost"
                className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
                onClick={() => {}}
              >
                <PlusIcon className="size-4" />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </BetterTooltip>
          )}

          <BetterTooltip content="对话">
            <CustomLink
              to={`/session/${sessionId}`}
              // disabled={!canHideChat}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <Icons.messageSquare className="size-5" />
            </CustomLink>
          </BetterTooltip>
          {/* <div className="w-[1px]" /> */}
          <Button
            disabled={!openWorkbench}
            variant={"ghost"}
            onClick={() => {
              setOpenWorkbench(!openWorkbench);
            }}
          >
            <Icons.code className="size-4" />
          </Button>

          <BetterTooltip content="配置">
            <CustomLink
              to={`/session/${chatSessionId}/config`}
              className={cn(buttonVariants({ variant: "ghost" }))}
              activeProps={{
                className: "outline outline-1 outline-offset-2 outline-red-500",
              }}
            >
              <Icons.settings className="size-4" />
            </CustomLink>
          </BetterTooltip>
        </div>
      </HeaderActionConainer>
    </DashHeaders>
  );
}
