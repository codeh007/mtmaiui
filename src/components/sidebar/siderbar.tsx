"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Command,
  Edit,
  FileText,
  Folder,
  ListTodo,
  MoreHorizontal,
  Share,
  Trash2,
} from "lucide-react";
import { frontendGetSiderbarOptions } from "mtmaiapi";
import { useIsMobile } from "mtxuilib/hooks/use-mobile";
import { IconX } from "mtxuilib/icons/icons";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "mtxuilib/ui/collapsible";
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
  useSidebar,
} from "mtxuilib/ui/sidebar";
import Link from "next/link";
import React, { useTransition } from "react";
import { Route } from "../../routes/~__root";
import { example_data } from "./example_data";
import { NavUser } from "./siderbarnav-user";

interface DashSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collapsed?: boolean;
  secondSidebar?: React.ReactNode;
}
export const DashSidebar = (props: DashSidebarProps) => {
  const { collapsed, secondSidebar, ...rest } = props;
  const [isPending, startTransition] = useTransition();
  // const { setOpenMobile } = useSidebar();
  const [mails, setMails] = React.useState(example_data.mails);
  const [activeItem, setActiveItem] = React.useState(example_data.navMain[0]);
  const { setOpen } = useSidebar();
  const nav = Route.useNavigate();
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...rest}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <CustomLink to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </CustomLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {example_data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        const mail = example_data.mails.sort(() => Math.random() - 0.5);
                        setMails(mail.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1)));
                        setOpen(true);
                        startTransition(() => {
                          nav({ to: item.url });
                        });
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={example_data.user} />
        </SidebarFooter>
      </Sidebar>

      {secondSidebar}
      {/* <SidebarSecond /> */}
      {/* <SidebarHeader>
        <SidebarMenuApp />
      </SidebarHeader>

      <SidebarContent>
        {chatProfileId && <NavChat chatProfileId={chatProfileId} />}
        <SidebarGroup>
          <MtSuspenseBoundary>
            <SidebarMenuView />
          </MtSuspenseBoundary>
        </SidebarGroup>

        <SidebarGroup>
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
                    <MtErrorBoundary>
                      <Suspense
                        fallback={
                          <SidebarGroup>
                            <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                              Today
                            </div>
                            <SidebarGroupContent>
                              <div className="flex flex-col">
                                {[44, 32, 28, 64, 52].map((item) => (
                                  <div
                                    key={item}
                                    className="rounded-md h-8 flex gap-2 px-2 items-center"
                                  >
                                    <div
                                      className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                                      style={
                                        {
                                          "--skeleton-width": `${item}%`,
                                        } as React.CSSProperties
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </SidebarGroupContent>
                          </SidebarGroup>
                        }
                      >
                        <SidebarHistory user={user} />
                      </Suspense>
                    </MtErrorBoundary>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {chatProfileId && <NavDevtools />}
        {user && (
          <SidebarGroup>
            <SidebarGroupContent>
              <NavUser />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
      <SidebarRail /> */}
    </Sidebar>
  );
};

interface SiteSidebarGroupProps {
  siteId?: string;
}
export const SiteSidebarGroup = (props: SiteSidebarGroupProps) => {
  const isMobile = useIsMobile();
  const { siteId } = props;
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
                <Link href={`/site/${siteId}/logs`}>
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
                  {item.icon && <IconX name={item.icon} className="size-5 m-0 p-0" />}
                  <span className="text-lg font-semibold">{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <CustomLink to={subItem.url}>
                          {subItem.icon && <IconX name={subItem.icon} className="size-5 m-0 p-0" />}
                          <span>{subItem.title}</span>
                        </CustomLink>
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
