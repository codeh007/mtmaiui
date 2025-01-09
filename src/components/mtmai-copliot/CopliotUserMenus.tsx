"use client";

import { useQuery } from "@tanstack/react-query";
import { SquareMenu } from "lucide-react";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Icons } from "mtxuilib/icons/icons";
import { useOpenChatProfile } from "../../hooks/hooks";
import { useChatProfile } from "../../hooks/useChatProfile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "mtxuilib/ui/dropdown-menu";
// import { useThreadStore } from "../../stores/ChatThread.store";

export function CopliotUserMenus() {
  const userQuery = useUserInfo();
  const logout = useLogout();
  const chatProfiles = useChatProfile();

  // const siderNavMenus = useMtmaiV2((x) => x.asiderMenus);
  const openChatProfile = useOpenChatProfile();
  // const isConnected = useThreadStore((x) => x.isConnected);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleNavItemClick = (item: any) => {
    console.log("点击", item);
  };
  return (
    <DropdownMenu>
      <div className="pr-2">
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              className="cursor-pointer hover:shadow-inner  ring-1"
              src={"/api/v1/users/avatar"}
              alt={`@${userQuery.data?.email}`}
            />
            <AvatarFallback className="cursor-pointer hover:shadow-inner ring-1">
              {/* <Icons.user className="w-6 h-6" /> */}
              {/* <Icons.messageSquare className="w-6 h-6" /> */}
              {/* <Waypoints className="size-5" /> */}
              {/* <DotsVerticalIcon className="size-4" /> */}
              <SquareMenu className="size-4" />
              <span className="sr-only">Open menu</span>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          {siderNavMenus?.map((item) => {
            return (
              <DropdownMenuItem
                key={item.url}
                onClick={() => handleNavItemClick(item)}
              >
                {item.title}
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <Icons.X className="size-4" />
          关闭Copliot
        </DropdownMenuItem>
        <Menuitem_Graphimage />

        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <Icons.X className="size-4" />
          <MtButton onClick={() => {}}>
            {isConnected ? "断开" : "连接"}
          </MtButton>
        </DropdownMenuItem>

        {chatProfiles?.map((x, i) => {
          return (
            <DropdownMenuItem
              onClick={() => {
                openChatProfile(x.name);
              }}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              // className="flex flex-col  p-2"
            >
              {/* <div className="w-full space-y-4 border shadow-sm p-2"> */}
              {x.markdown_description}
              {/* </div> */}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Menuitem_Graphimage = () => {
  const query = useQuery({
    ...chatGraphImageOptions({
      path: {
        thread_id: "1",
      },
    }),
  });
  return (
    <DropdownMenuItem>
      查看流程图
      <DebugValue data={{ query }} />
    </DropdownMenuItem>
  );
};
