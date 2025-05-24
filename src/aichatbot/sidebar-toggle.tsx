import type { ComponentProps } from "react";

import { type SidebarTrigger, useSidebar } from "mtxuilib/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";

import { Button } from "mtxuilib/ui/button";
import { SidebarLeftIcon } from "./icons";

export function SidebarToggle({ className }: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="sidebar-toggle-button"
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
