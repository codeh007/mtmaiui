"use client";
import { useQuery } from "@tanstack/react-query";
import { basicTimeFormat, cn } from "mtxuilib/lib/utils";
import { StatusBadge } from "../../../components/StatusBadge";

import { useMtRouter } from "mtxuilib/hooks/use-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "mtxuilib/ui/table";
import { useSearchParams } from "next/navigation";
import { useBasePath } from "../../../../hooks/useBasePath";
import { TaskActions } from "./TaskActions";
import { TaskListSkeletonRows } from "./TaskListSkeletonRows";
export function TaskHistory() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const router = useMtRouter();

  // const {
  // 	data: tasks,
  // 	isPending,
  // 	isError,
  // 	error,
  // } = useQuery<Array<TaskApiResponse>>({
  // 	queryKey: ["tasks", "history", page],
  // 	queryFn: async () => {
  // 		const client = await getClient(credentialGetter);
  // 		const params = new URLSearchParams();
  // 		params.append("page", String(page));
  // 		params.append("page_size", String(PAGE_SIZE));
  // 		params.append("task_status", "completed");
  // 		params.append("task_status", "failed");
  // 		params.append("task_status", "terminated");
  // 		params.append("task_status", "timed_out");
  // 		params.append("task_status", "canceled");
  // 		params.append("only_standalone_tasks", "true");

  // 		return client
  // 			.get("/tasks", {
  // 				params,
  // 			})
  // 			.then((response) => response.data);
  // 	},
  // });

  const { data: tasks, isPending } = useQuery({
    ...agentGetAgentTasksOptions({
      query: {
        task_status: [
          "completed",
          "failed",
          "terminated",
          "timed_out",
          "canceled",
        ],
        only_standalone_tasks: true,
      },
    }),
    refetchOnMount: true,
  });

  const basePath = useBasePath();
  function handleNavigate(event: React.MouseEvent, id: string) {
    if (event.ctrlKey || event.metaKey) {
      window.open(
        `${window.location.origin}/tasks/${id}/actions`,
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      router.push(`${basePath}/tasks/${id}/actions`);
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">ID</TableHead>
              <TableHead className="w-1/4">URL</TableHead>
              <TableHead className="w-1/6">状态</TableHead>
              <TableHead className="w-1/4">创建于</TableHead>
              <TableHead className="w-1/12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TaskListSkeletonRows />
            ) : tasks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No tasks found</TableCell>
              </TableRow>
            ) : (
              tasks?.map((task) => {
                return (
                  <TableRow key={task.task_id}>
                    <TableCell
                      className="w-1/4 cursor-pointer"
                      onClick={(event) => handleNavigate(event, task.task_id)}
                    >
                      {task.task_id}
                    </TableCell>
                    <TableCell
                      className="w-1/4 max-w-64 cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap"
                      onClick={(event) => handleNavigate(event, task.task_id)}
                    >
                      {task.request.url}
                    </TableCell>
                    <TableCell
                      className="w-1/6 cursor-pointer"
                      onClick={(event) => handleNavigate(event, task.task_id)}
                    >
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell
                      className="w-1/4 cursor-pointer"
                      onClick={(event) => handleNavigate(event, task.task_id)}
                    >
                      {basicTimeFormat(task.created_at)}
                    </TableCell>
                    <TableCell className="w-1/12">
                      <TaskActions task={task} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination className="pt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn({ "cursor-not-allowed": page === 1 })}
              onClick={() => {
                if (page === 1) {
                  return;
                }
                const params = new URLSearchParams();
                params.set("page", String(Math.max(1, page - 1)));
                setSearchParams(params, { replace: true });
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                const params = new URLSearchParams();
                params.set("page", String(page + 1));
                setSearchParams(params, { replace: true });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
