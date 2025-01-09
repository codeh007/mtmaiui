"use client";

import { basicTimeFormat } from "mtxuilib/lib/utils";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { useWorkflowLastRunQuery } from "../hooks/useWorkflowLastRunQuery";

type Props = {
  workflowId: string;
};

export function LastRunAtTime({ workflowId }: Props) {
  const { data, isLoading } = useWorkflowLastRunQuery({ workflowId });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!data) {
    return null;
  }

  if (data.status === "N/A") {
    return <span>N/A</span>;
  }

  return <span>{basicTimeFormat(data.time)}</span>;
}
