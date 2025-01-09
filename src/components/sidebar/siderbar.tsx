"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Edit,
  FileText,
  Folder,
  ListTodo,
  MoreHorizontal,
  Share,
  Trash2,
} from "lucide-react";
import { frontendGetSiderbarOptions } from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useIsMobile } from "mtxuilib/hooks/use-mobile";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { IconX, Icons } from "mtxuilib/icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "mtxuilib/ui/sidebar";
import Link from "next/link";
import { user } from "../../db/schema";
import { useIsAdmin } from "../../hooks/useAuth";
import { SidebarMenuApp } from "./SidebarMenuApp";
import { NavChat } from "./nav-chatprofile";
import { NavDevtools } from "./nav-devtools";
import { SidebarHistory } from "./sidebar-history";
import { NavUser } from "./siderbarnav-user";

/*************************************************************************
 * 备忘：
 * 1: **侧边栏不要直接放到 layout.tsx中, 而是应该放到页面中**
 * 2: 如果需要不同页面不同的功能，应该直接使用参数，例如: detailId,

 *************************************************************************/

interface DashSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collapsed?: boolean;
  siteId?: string;
  chatProfileId?: string;
  actionName?: string; // 通常对应子页面, edit|show|delete
}
export const DashSidebar = (props: DashSidebarProps) => {
  const { siteId, collapsed, chatProfileId, ...rest } = props;
  const { setOpenMobile } = useSidebar();
  const router = useMtRouter();
  const isAdmin = useIsAdmin();
  return (
    <Sidebar className="group-data-[side=left]:border-r-0" {...rest}>
      <SidebarHeader>
        <SidebarMenuApp />
      </SidebarHeader>

      <SidebarContent>
        {chatProfileId && <NavChat chatProfileId={chatProfileId} />}
        <SidebarGroup>
          {/* <SidebarGroupLabel>main menu</SidebarGroupLabel> */}
          <MtSuspenseBoundary>
            <SidebarMenuView />
          </MtSuspenseBoundary>
        </SidebarGroup>

        <SidebarGroup>
          {/* 聊天历史 */}
          <SidebarMenu>
            <Collapsible
              key={"siderbar-chats"}
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={"chats"}>
                    <Icons.PaperPlane />
                    <span>chat</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarHistory user={user} />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {chatProfileId && <NavDevtools />}

        {/* 用户导航 */}
        {user && (
          <SidebarGroup>
            <SidebarGroupContent>
              <NavUser />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

interface SiteSidebarGroupProps {
  siteId?: string;
}
export const SiteSidebarGroup = (props: SiteSidebarGroupProps) => {
  const isMobile = useIsMobile();
  const { siteId } = props;
  // const siteQuery = useSuspenseQuery({
  //   ...siteGetSiteOptions({
  //     path: { id: siteId },
  //   }),
  // });
  return (
    <Collapsible
      // key={item.title}
      title={"站点列表"}
      // defaultOpen
      className="group/collapsible"
    >
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        {/* <SidebarGroupLabel>
				<Link href={`/dash/site/${siteId}`}>{siteQuery.data?.title}</Link>
			</SidebarGroupLabel> */}

        <SidebarGroupLabel
          asChild
          className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <CollapsibleTrigger>
            <Link href={`/dash/site/${siteId}`}>
              {/* <item.icon /> */}
              {/* <span>{siteQuery.data?.title}</span> */}
            </Link>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>查看</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="text-muted-foreground" />
                    <span>共享</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>删除</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Edit />
                <Link href={`/dash/site/${siteId}/edit`}>
                  <span>站点配置</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ListTodo />
                <Link href={`/dash/site/${siteId}/siteauto`}>
                  <span>自动化配置</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                <Link href={`/dash/site/${siteId}/articles`}>
                  <span>文章</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                <Link href={`/dash/site/${siteId}/logs`}>
                  <span>日志</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ListTodo />
                <Link href={`/dash/site/${siteId}/tasks`}>
                  <span>任务</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export const SidebarMenuView = () => {
  const siderbarQuery = useSuspenseQuery({
    ...frontendGetSiderbarOptions({}),
  });
  return (
    <>
      <SidebarMenu>
        {siderbarQuery.data?.sideritems?.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item?.isActive || item.defaultExpanded}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && (
                    <IconX name={item.icon} className="size-5 m-0 p-0" />
                  )}
                  <span className="text-lg font-semibold">{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* <DebugValue data={item} /> */}
                  {item.children?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </>
  );
};
