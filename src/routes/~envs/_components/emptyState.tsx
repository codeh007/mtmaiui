"use client";

import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";

export const EnvEmptyState = (
  <Card className="w-full text-justify">
    <CardHeader>
      <CardTitle>No Envs</CardTitle>
      <CardDescription>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          There are no workflows registered in this tenant. To enable workflow
          execution, please register a workflow with a worker or{" "}
          <a href="support@hatchet.run">contact support</a>.
        </p>
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <CustomLink to="#" className="flex flex-row item-center">
        <Button onClick={() => {}} variant="link" className="p-0 w-fit">
          {/* <QuestionMarkCircleIcon className={cn("h-4 w-4 mr-2")} /> */}
          {/* Docs: Understanding Workflows in Hatchet */}
        </Button>
      </CustomLink>
    </CardFooter>
  </Card>
);
