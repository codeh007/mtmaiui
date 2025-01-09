"use client";
import { StatusBadge } from "../../../components/StatusBadge";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { basicTimeFormat } from "mtxuilib/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "mtxuilib/ui/table";
import { useBasePath } from "../../../../hooks/useBasePath";
export function QueuedTasks() {
  const router = useMtRouter();
  const basePath = useBasePath();
  const query = useSuspenseQuery({
    ...agentGetAgentTasksOptions({
      query: {
        task_status: ["queued"],
        only_standalone_tasks: true,
      },
    }),
    refetchOnMount: true,
  });
  const tasks = query.data;
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
    <div className="rounded-md border">
      <DebugValue data={tasks} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">ID</TableHead>
            <TableHead className="w-1/4">URL</TableHead>
            <TableHead className="w-1/4">状态</TableHead>
            <TableHead className="w-1/4">创建于</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No queued tasks</TableCell>
            </TableRow>
          ) : (
            tasks?.map((task) => {
              return (
                <TableRow
                  key={task.task_id}
                  className="w-4"
                  onClick={(event) => handleNavigate(event, task.task_id)}
                >
                  <TableCell className="w-1/4">{task.task_id}</TableCell>
                  <TableCell className="w-1/4 max-w-64 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {task.request.url}
                  </TableCell>
                  <TableCell className="w-1/4">
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="w-1/4">
                    {basicTimeFormat(task.created_at)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
