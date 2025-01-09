"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "mtxuilib/ui/card";
import Link from "next/link";

export const WorkflowEmptyCard = () => {
  return (
    <>
      <Card className="w-full text-justify">
        <CardHeader>
          <CardTitle>No Registered Workflows</CardTitle>
          <CardDescription>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              There are no workflows registered in this tenant. To enable
              workflow execution, please register a workflow with a worker or{" "}
              <a href="support@hatchet.run">contact support</a>.
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="#" className="flex flex-row item-center">
            <Button onClick={() => {}} variant="link" className="p-0 w-fit">
              <QuestionMarkCircleIcon className={cn("h-4 w-4 mr-2")} />
              Docs: Understanding Workflows in Hatchet
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};
