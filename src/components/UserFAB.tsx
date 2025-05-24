"use client";

import { IconX, Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  // adminReleaseConnMutation,
  // adminResetDbMutation,
  frontendGetSiderbarOptions,
} from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useToast } from "mtxuilib/ui/use-toast";
import { useUser } from "../hooks/useAuth";
export const UserFAB = () => {
  const [openCmdk, setOpenCmdk] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const user = useUser();
  const navigate = useNavigate();

  const handleOpenDropdown = () => {
    if (!user) {
      // signin("credentials");
      navigate({
        to: "/auth/login",
      });
    }
    setOpenDropdown(true);
  };
  return (
    <>
      {/* {openCmdk && <AssistantModal />} */}

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "fixed bottom-14 right-4 z-40",
              "bg-tertiary/20 text-tertiary-foreground border border-slate-500 hover:bg-tertiary/10 rounded-lg",
            )}
            onClick={handleOpenDropdown}
          >
            <Icons.apple />
          </Button>
        </DropdownMenuTrigger>
        {user && (
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <MtSuspenseBoundary>
              <UserFABDropdownMenuContent />
            </MtSuspenseBoundary>
            <DropdownMenuSeparator />
            <AdminFABDropdownMenuContent />
            <DropdownMenuSeparator />
            <TestingMenuContent />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log("TODO: logout");
              }}
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
};

const UserFABDropdownMenuContent = () => {
  const siderbarQuery = useSuspenseQuery({
    ...frontendGetSiderbarOptions({}),
  });

  if (!siderbarQuery.data?.sideritems) {
    return null;
  }
  return (
    <>
      {siderbarQuery.data?.sideritems?.map((item) => (
        <DropdownMenuGroup key={item.title}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {item.icon && <IconX name={item.icon} className="size-5 m-0 p-0" />}
              <span className="text-lg font-semibold">{item.title}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {item.children?.map((subItem) => (
                  <CustomLink key={subItem.title} to={subItem.url}>
                    <DropdownMenuItem>
                      <span>{subItem.title}</span>
                    </DropdownMenuItem>
                  </CustomLink>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      ))}
    </>
  );
};

const AdminFABDropdownMenuContent = () => {
  const toast = useToast();
  // const adminReleaseConn = useMutation({
  //   ...adminReleaseConnMutation(),
  //   onSuccess: () => {
  //     toast.toast({
  //       title: "释放数据库连接成功",
  //     });
  //   },
  // });

  // const adminResetDb = useMutation({
  //   ...adminResetDbMutation(),
  //   onSuccess: () => {
  //     toast.toast({
  //       title: "清理数据库表成功",
  //     });
  //   },
  // });

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>管理</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {/* <DropdownMenuItem
              onClick={() => {
                // adminReleaseConn.mutate({});
              }}
            >
              释放数据库连接
            </DropdownMenuItem>
             */}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};

const TestingMenuContent = () => {
  const toast = useToast();
  // const adminReleaseConn = useMutation({
  //   ...adminReleaseConnMutation(),
  //   onSuccess: () => {
  //     toast.toast({
  //       title: "释放数据库连接成功",
  //     });
  //   },
  // });

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>临时测试</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={async () => {
                const url = "https://text.pollinations.ai/openai";
                const payload = {
                  model: "openai-audio",
                  messages: [{ role: "user", content: "你好" }],
                  voice: "alloy",
                };
                const response = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const data = await response.text();
                console.log(data);
              }}
            >
              测试1
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};
