"use client";

import { Pencil2Icon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { basicTimeFormat, cn } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { Skeleton } from "mtxuilib/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "mtxuilib/ui/table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useBasePath } from "../../../hooks/useBasePath";
import { StatusBadge } from "../../components/StatusBadge";

interface WorkflowPageProps {
  workflowPermanentId: string;
}
export function WorkflowPage(props: WorkflowPageProps) {
  const { workflowPermanentId } = props;
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const router = useMtRouter();

  const { data: workflowRuns, isLoading } = useQuery({
    // queryKey: ["workflowRuns", workflowPermanentId, page],
    // queryFn: async () => {
    //   // const client = await getClient(credentialGetter);
    //   const params = new URLSearchParams();
    //   params.append("page", String(page));
    //   return client
    //     .get(`/workflows/${workflowPermanentId}/runs`, {
    //       params,
    //     })
    //     .then((response) => response.data);
    // },
    ...getWorkflowRunsOptions({
      path: {
        workflow_id: workflowPermanentId,
      },
      query: {
        page,
      },
    }),
  });

  const basePath = useBasePath();
  const { data: workflow, isLoading: workflowIsLoading } = useQuery({
    // queryKey: ["workflow", workflowPermanentId],
    // queryFn: async () => {
    //   // const client = await getClient(credentialGetter);
    //   return client
    //     .get(`/workflows/${workflowPermanentId}`)
    //     .then((response) => response.data);
    // },
    ...getWorkflowOptions({
      path: {
        workflow_permanent_id: workflowPermanentId,
      },
    }),
  });

  if (!workflowPermanentId) {
    return null; // this should never happen
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between">
        <div className="flex flex-col gap-2">
          {workflowIsLoading ? (
            <>
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-7 w-56" />
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold">{workflow?.title}</h1>
              <h2 className="text-sm">{workflowPermanentId}</h2>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`${basePath}/workflows/${workflowPermanentId}/edit`}>
              <Pencil2Icon className="mr-2 h-4 w-4" />
              编辑工作流
            </Link>
          </Button>
          <Button asChild>
            <Link href={`${basePath}/workflows/${workflowPermanentId}/run`}>
              创建新运行
            </Link>
          </Button>
          <DebugValue data={workflow} />
        </div>
      </header>
      <div className="space-y-4">
        <header>
          <h1 className="text-lg font-semibold">Past Runs</h1>
        </header>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">ID</TableHead>
                <TableHead className="w-1/3">Status</TableHead>
                <TableHead className="w-1/3">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : workflowRuns?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No workflow runs found</TableCell>
                </TableRow>
              ) : (
                workflowRuns?.map((workflowRun) => (
                  <TableRow
                    key={workflowRun.workflow_run_id}
                    onClick={(event) => {
                      if (event.ctrlKey || event.metaKey) {
                        window.open(
                          `${window.location.origin}/workflows/${workflowPermanentId}/${workflowRun.workflow_run_id}`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                        return;
                      }
                      router.push(
                        `${basePath}/workflows/${workflowPermanentId}/${workflowRun.workflow_run_id}`,
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell>{workflowRun.workflow_run_id}</TableCell>
                    <TableCell>
                      <StatusBadge status={workflowRun.status} />
                    </TableCell>
                    <TableCell>
                      {basicTimeFormat(workflowRun.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
        </div>
      </div>
    </div>
  );
}
