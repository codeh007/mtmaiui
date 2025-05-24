"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/resource/new")({
  component: RouteComponent,
});

function RouteComponent() {
  // const createPlatformAccountMutation = useMutation({
  //   ...platformAccountCreateMutation(),
  // });
  // const tid = useTenantId();
  // const form = useZodForm({
  //   schema: zPlatformAccount,
  //   defaultValues: {},
  // });
  return (
    <div className="flex flex-col h-full w-full px-2">
      <div className="bg-blue-100 p-2 gap-1.5">
        <CustomLink
          className={cn(buttonVariants({ variant: "ghost" }))}
          to="res/platform_account"
        >
          平台账号
        </CustomLink>
        <CustomLink
          className={cn(buttonVariants({ variant: "ghost" }))}
          to="res/browser"
        >
          浏览器配置
        </CustomLink>

        <CustomLink
          className={cn(buttonVariants({ variant: "ghost" }))}
          to="res/chat"
        >
          对话
        </CustomLink>
      </div>
      <Outlet />
    </div>
  );
}
