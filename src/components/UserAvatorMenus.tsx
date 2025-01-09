"use client";

import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { MtLink } from "mtxuilib/mt/mtlink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { useMtmaiV2 } from "../stores/StoreProvider";

export default function UserAvatorMenus() {
  const userQuery = useUserInfo();
  const logout = useLogout();
  const loginPath = useMtmaiV2((x) => x.coreConfig?.loginPath || "");
  return (
    <>
      <DropdownMenu>
        {!userQuery.data?.id && (
          <DropdownMenuTrigger asChild>
            <MtLink
              variant="ghost"
              className={cn(
                "overflow-hidden rounded-full w-12 h-12 p-0 m-0 hover:bg-gray-200 hover:shadow-inner hover:shadow-gray-300",
              )}
              href={loginPath}
            >
              <Icons.user className="size-5" />
            </MtLink>
          </DropdownMenuTrigger>
        )}
        {userQuery.data?.id && (
          <>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  className="cursor-pointer hover:shadow-inner hover:shadow-gray-300"
                  src={"/api/v1/users/avatar"}
                  alt={`@${userQuery.data?.email}`}
                />
                <AvatarFallback>
                  <MtLink href={loginPath}>
                    <Icons.user className="w-6 h-6" />
                  </MtLink>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem
								onClick={() => {
									setOpenDebugPanel(!openDebugPanel);
								}}
							>
								toggle assistant devtools
								<DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
							</DropdownMenuItem> */}
              <DropdownMenuGroup>
                {/* <DropdownMenuItem>
                  设置
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem> */}
                {/* <MtLink href={"/admin/cx"}>
                  <DropdownMenuItem>
                    cx
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </MtLink> */}

                {/* <DropdownMenuItem>
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Cx</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <MtLink href={"/admin/cx/config"}>
                    <DropdownMenuItem>config</DropdownMenuItem>
                  </MtLink>
                  <MtLink href={"/admin/cx/result"}>
                    <DropdownMenuItem>result</DropdownMenuItem>
                  </MtLink>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup> */}
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
                <DropdownMenuItem>theme</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <SunIcon className="size-[1.2rem] rotate-0 scale-100 pr-1 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 pr-1 transition-all dark:rotate-0 dark:scale-100" />
                    主题
                    <span className="sr-only">切换</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              */}
              {/* <DropdownMenuGroupDevelop></DropdownMenuGroupDevelop> */}
              <DropdownMenuItem
                onClick={() => {
                  logout();
                }}
              >
                退出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>
        )}
      </DropdownMenu>
    </>
  );
}
