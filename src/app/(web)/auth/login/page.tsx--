"use client";

import { LoginWithCreddents } from "@mtmaiui/components/auth/UserLoginView";
import { ChevronLeft } from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { ScreenPanel } from "mtxuilib/mt/ScreenPanel";
import { buttonVariants } from "mtxuilib/ui/button";
import Link from "next/link";
import { LoginGithub } from "../../../../components/auth/LoginGithub";
export default function Page(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <ScreenPanel open={true}>
      <div className="size-screen container flex flex-col items-center justify-center">
        <div className="absolute left-4 top-20 focus:z-10 focus:outline-hidden md:left-8 md:top-8">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "p-0")}>
            <ChevronLeft />
          </Link>
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo color="white" className="mx-auto size-12" />
            <h1 className="text-2xl font-bold ">欢迎回来</h1>
            {/* <p className="text-sm ">Sign in with Github to login</p> */}
          </div>
          <div className={cn("grid gap-6")}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t " />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-appbg px-2 ">Continue with</span>
              </div>
            </div>

            <LoginGithub className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-appbg px-2 ">OR</span>
          </div>
          <LoginWithCreddents />
        </div>
      </div>
    </ScreenPanel>
  );
}
