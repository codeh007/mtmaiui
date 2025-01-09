"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "mtxuilib/ui/sidebar";
import Link from "next/link";

interface NavChatProps {
  chatProfileId: string;
}
export function NavChat({ chatProfileId }: NavChatProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>当前交互</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={`/dash/chat-profile/${chatProfileId}/edit`}>
            <SidebarMenuButton>配置</SidebarMenuButton>
          </Link>
          <Link href={`/dash/chat-profile/${chatProfileId}/history`}>
            <SidebarMenuButton>历史</SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
