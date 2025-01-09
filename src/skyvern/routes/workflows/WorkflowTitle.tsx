"use client";

import { Skeleton } from "mtxuilib/ui/skeleton";

type Props = {
  workflowPermanentId: string;
};

export function WorkflowTitle({ workflowPermanentId }: Props) {
  // const query = useQuery({
  //   ...getWorkflowOptions({
  //     path: {
  //       workflow_permanent_id: workflowPermanentId,
  //     },
  //   }),
  // });

  if (query.isLoading) {
    return <Skeleton className="h-6 w-full" />;
  }

  if (query.isError || !query.data) {
    return <span />;
  }

  return <span>{query.data.title}</span>;
}
