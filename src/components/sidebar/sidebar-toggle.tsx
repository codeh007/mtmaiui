import { SidebarLeftIcon } from "mtxuilib/icons/aichatbot.icons";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { type SidebarTrigger, useSidebar } from "mtxuilib/ui/sidebar";
import { BetterTooltip } from "mtxuilib/ui/tooltip";
import type { ComponentProps } from "react";

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <BetterTooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={toggleSidebar}
        variant="outline"
        className={cn("md:px-2 md:h-fit", className)}
      >
        <SidebarLeftIcon size={16} />
      </Button>
    </BetterTooltip>
  );
}
