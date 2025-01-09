"use client";

import { useWindowSize } from "usehooks-ts";
import { ModelSelector } from "../model-selector";

import { PlusIcon } from "mtxuilib/icons/aichatbot.icons";
import { useRouter } from "next-nprogress-bar";
import { Suspense } from "react";
import { ChatDescription } from "../../../lib/persistence/ChatDescription.client";
import { HeaderActionButtons } from "./HeaderActionButtons";
import classNames from "classnames";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { useSidebar, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { BetterTooltip } from "mtxuilib/ui/tooltip";
import { useWorkbrenchStore } from "../../../stores/workbrench.store";

export function Header() {
  const started = useWorkbrenchStore((x) => x.started);

  const router = useRouter();
  const { open } = useSidebar();

  const selectedModelId = useWorkbrenchStore((x) => x.selectedModelId);

  const { width: windowWidth } = useWindowSize();

  return (
    <header
      className={classNames(
        "flex items-center bg-bolt-elements-background-depth-1 p-5 border-b h-[var(--header-height)]",
        {
          "border-transparent": !started,
          "border-bolt-elements-borderColor": started,
        },
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>交互执行</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <div className="flex justify-center items-center flex-1">
				<MenuBar />
			</div> */}

      {(!open || windowWidth < 768) && (
        <BetterTooltip content="New Chat">
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        </BetterTooltip>
      )}

      <MtSuspenseBoundary>
        <ModelSelector
          selectedModelId={selectedModelId || ""}
          className="order-1 md:order-2"
        />
      </MtSuspenseBoundary>
      <Button
        className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
        asChild
      >
        mtmai
      </Button>

      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a
          href="/"
          className="text-2xl font-semibold text-accent flex items-center"
        >
          <span className="i-bolt:logo-text?mask w-[46px] inline-block" />
        </a>
      </div>

      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <ChatDescription />
      </span>
      {/* {chat.started && ( */}
      <div className="mr-1">
        <HeaderActionButtons />
      </div>
      {/*  )} */}
      {/* <ThemeSwitch /> */}
      <Suspense>{/* <UserAvatorMenus /> */}</Suspense>
    </header>
  );
}
