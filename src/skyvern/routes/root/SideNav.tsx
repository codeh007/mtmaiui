"use client";

import {
  GearIcon,
  LightningBoltIcon,
  ListBulletIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "mtxuilib/lib/utils";
import Link from "next/link";

type Props = {
  collapsed: boolean;
};

export function SideNav({ collapsed }: Props) {
  return (
    <nav className="space-y-2">
      <Link
        href="create"
        className={cn(
          "flex h-[3.25rem] items-center gap-4 rounded-2xl px-5 hover:bg-muted",
          {
            // "bg-muted": isActive,
          },
        )}
      >
        <PlusCircledIcon className="h-6 w-6" />
        {!collapsed && <span className="text-lg">Create</span>}
      </Link>
      <Link
        href="tasks"
        className={cn(
          "flex h-[3.25rem] items-center gap-4 rounded-2xl px-5 hover:bg-muted",
          // "bg-muted": isActive,
        )}
      >
        <ListBulletIcon className="h-6 w-6" />
        {/* {!collapsed && <span className="text-lg">Tasks</span>} */}
      </Link>
      <Link
        href="workflows"
        className={cn(
          "flex h-[3.25rem] items-center gap-4 rounded-2xl px-5 hover:bg-muted",
          {
            // "bg-muted": isActive,
          },
        )}
      >
        <LightningBoltIcon className="h-6 w-6" />
        {!collapsed && <span className="text-lg">Workflows</span>}
      </Link>
      <Link
        href="settings"
        className={cn(
          "flex h-[3.25rem] items-center gap-4 rounded-2xl px-5 hover:bg-muted",
          {
            // "bg-muted": isActive,
          },
        )}
      >
        <GearIcon className="h-6 w-6" />
        {!collapsed && <span className="text-lg">Settings</span>}
      </Link>
    </nav>
  );
}
