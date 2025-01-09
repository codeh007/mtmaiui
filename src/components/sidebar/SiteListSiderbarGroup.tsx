"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "mtxuilib/ui/sidebar";
import Link from "next/link";

export function SiteListSidebarGroup() {
  const listQuery = useSuspenseQuery({
    ...listviewListviewSearchOptions({
      body: {
        // ...searchParams,
        dataType: "site",
      },
    }),
  });

  const items = listQuery.data?.items;
  return (
    <Collapsible
      // key={item.title}
      title={"站点列表"}
      defaultOpen
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <CollapsibleTrigger>
            站点列表
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={item.content_id ?? ""} className="font-medium">
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                  {/* {items?.length ? (
								<SidebarMenuSub>
									{items?.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton asChild isActive={item.isActive}>
												<a href={item.url}>{item.title}</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							) : null} */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
