"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "mtxuilib/lib/utils";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import Link from "next/link";

export const AgentNodeEmptyState = () => {
  return (
    <Card className="w-full text-justify">
      <CardHeader>
        <CardTitle>No Active Agent Nodes</CardTitle>
        <CardDescription>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            There are no agent nodes currently running and connected to the
            Hatchet engine for this tenant. To enable workflow execution, please
            attempt to start a worker process or{" "}
            <a href="support@hatchet.run">contact support</a>.
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row item-center">
        <Link
          onClick={() => {}}
          href={""}
          className={cn(
            "p-0 w-fit flex items-center justify-center",
            buttonVariants({
              variant: "ghost",
              size: "icon",
            }),
          )}
        >
          <QuestionMarkCircleIcon className={cn("h-4 w-4 mr-2")} />
        </Link>
      </CardFooter>
    </Card>
  );
};
