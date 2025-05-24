"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";

export const WorkflowEmptyCard = () => {
  return (
    <>
      <Card className="w-full text-justify">
        <CardHeader>
          <CardTitle>没有注册的工作流</CardTitle>
          <CardDescription>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              没有注册的工作流.
              <a href="support@hatchet.run">联系支持</a>.
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <CustomLink to="/workflows" className="flex flex-row item-center">
            <Button onClick={() => {}} variant="link" className="p-0 w-fit">
              <QuestionMarkCircleIcon className={cn("h-4 w-4 mr-2")} />
              帮助文档
            </Button>
          </CustomLink>
        </CardFooter>
      </Card>
    </>
  );
};
