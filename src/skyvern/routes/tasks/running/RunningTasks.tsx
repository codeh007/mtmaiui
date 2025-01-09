"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import Link from "next/link";
import { useBasePath } from "../../../../hooks/useBasePath";

import { useMtRouter } from "mtxuilib/hooks/use-router";
import { basicTimeFormat } from "mtxuilib/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";
import { LatestScreenshot } from "./LatestScreenshot";

export function RunningTasks() {
  const router = useMtRouter();

  // const { data: runningTasks } = useQuery<Array<TaskApiResponse>>({
  // 	queryKey: ["tasks", "running"],
  // 	queryFn: async () => {
  // 		const client = await getClient(credentialGetter);
  // 		return client
  // 			.get("/tasks", {
  // 				params: {
  // 					task_status: "running",
  // 					only_standalone_tasks: "true",
  // 				},
  // 			})
  // 			.then((response) => response.data);
  // 	},
  // 	refetchOnMount: true,
  // });
  const query = useSuspenseQuery({
    ...agentGetAgentTasksOptions({
      query: {
        task_status: ["running"],
        only_standalone_tasks: true,
      },
    }),
    refetchOnMount: true,
  });

  if (query.data?.length === 0) {
    return <div>No running tasks</div>;
  }

  return query.data?.map((task) => {
    const basePath = useBasePath();
    return (
      <Card
        key={task.task_id}
        className="cursor-pointer hover:bg-muted/50"
        // onClick={(event) => {
        // 	// if (event.target === event.currentTarget) {
        // 	handleNavigate(event, task.task_id);
        // 	// }
        // }}
      >
        <CardHeader>
          <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href={`${basePath}/tasks/${task.task_id}/actions`}>
              {task.task_id}
            </Link>
          </CardTitle>
          <CardDescription className="overflow-hidden text-ellipsis whitespace-nowrap">
            {task?.request?.url}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="h-40 w-40">
            <LatestScreenshot id={task.task_id} />
          </div>
        </CardContent>
        <CardFooter>创建于: {basicTimeFormat(task.created_at)}</CardFooter>
      </Card>
    );
  });
}
