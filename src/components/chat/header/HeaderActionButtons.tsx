"use client";

import classNames from "classnames";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { buttonVariants } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import Link from "next/link";
import { useWorkbrenchStore } from "../../../stores/workbrench.store";

export function HeaderActionButtons() {
  const showWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);
  const setShowWorkbench = useWorkbrenchStore((x) => x.setShowWorkbench);

  const openChat = useWorkbrenchStore((x) => x.uiState.openChat);
  const setOpenChat = useWorkbrenchStore((x) => x.setOpenChat);
  const canHideChat = showWorkbench || !openChat;

  const chatProfileId = useWorkbrenchStore((x) => x.chatProfile);
  return (
    <div className="flex">
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button
          active={!!openChat}
          disabled={!canHideChat}
          onClick={() => {
            if (canHideChat) {
              setOpenChat(!openChat);
            }
          }}
        >
          <Icons.messageSquare className="size-5" />
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor" />
        <Button
          active={!!showWorkbench}
          onClick={() => {
            if (showWorkbench && !openChat) {
              setOpenChat(true);
            }
            setShowWorkbench(!showWorkbench);
          }}
        >
          <Icons.code />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link
          // active={!!showWorkbench}
          className={cn(buttonVariants({ variant: "ghost" }))}
          href={`/dash/chat-profile/${chatProfileId}/edit`}
          onClick={() => {
            if (showWorkbench && !openChat) {
              setOpenChat(true);
            }
            setShowWorkbench(!showWorkbench);
          }}
        >
          <Icons.settings className="size-4" />
        </Link>
      </div>
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  children?: any;
  onClick?: VoidFunction;
}

function Button({
  active = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames("flex items-center p-1.5", {
        "bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary":
          !active,
        "bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent":
          active && !disabled,
        "bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed":
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
