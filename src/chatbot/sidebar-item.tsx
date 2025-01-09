"use client";

import type * as React from "react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { motion } from "framer-motion";
import { cn } from "mtxuilib/lib/utils";
import { buttonVariants } from "mtxuilib/ui/button";
import { useAgentName } from "./hooks";

interface SidebarItemProps {
  index: number;
  item: any;
  children: React.ReactNode;
}

export function SidebarItem({ index, item: chat, children }: SidebarItemProps) {
  const pathname = usePathname();

  const searchs = useSearchParams();

  const isActive = pathname === searchs.get("threadId");
  const [newChatId, setNewChatId] = useLocalStorage("newChatId", null);
  const shouldAnimate = index === 0 && isActive && newChatId;
  const agent = useAgentName();

  if (!chat?.id) return null;

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: "auto",
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? "initial" : undefined}
      animate={shouldAnimate ? "animate" : undefined}
      transition={{
        duration: 0.25,
        ease: "easeIn",
      }}
    >
      <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        {/* {chat.sharePath ? (
					<Tooltip delayDuration={1000}>
						<TooltipTrigger
							tabIndex={-1}
							className="focus:bg-muted focus:ring-1 focus:ring-ring"
						>
							<IconUsers className="mr-2 mt-1 text-zinc-500" />
						</TooltipTrigger>
						<TooltipContent>This is a shared chat.</TooltipContent>
					</Tooltip>
				) : (
					<IconMessage className="mr-2 mt-1 text-zinc-500" />
				)} */}
      </div>
      <Link
        href={`/agent?agent=${agent}&threadId=${chat.id}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10",
          isActive && "bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800",
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title || "no-title"}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title?.split("").map((character, index) => (
                <motion.span
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05,
                  }}
                  onAnimationComplete={() => {
                    // if (index === chat.title?.length - 1) {
                    // 	setNewChatId(null);
                    // }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title || "无标题"}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  );
}
