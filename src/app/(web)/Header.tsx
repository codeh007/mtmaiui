"use client";
import { cn } from "mtxuilib/lib/utils";
import Link from "next/link";

const WebNavs = [
  {
    label: "首页",
    href: "/",
  },
  {
    label: "文档",
    href: "/doc",
  },
  {
    label: "智能工作室",
    href: "/ag#/chat",
  },
  {
    label: "用户注册",
    href: "/ag#/auth/register",
  },
];

export const WebLayoutHeader = () => {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 pt-1 ",
        "sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6",
        "fixed top-0 left-0",
        "bg-slate-200 w-full",
      )}
      // className="sticky top-0 flex h-14 items-center gap-4 border-b px-4 pt-1 "
    >
      <div className="flex-1">
        <nav className="flex gap-4">
          {WebNavs.map((nav) => (
            <Link key={nav.href} href={nav.href}>
              {nav.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
