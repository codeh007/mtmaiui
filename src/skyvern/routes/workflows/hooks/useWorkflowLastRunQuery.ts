"use client";
import { useQuery } from "@tanstack/react-query";
import type { Status, WorkflowRunApiResponse } from "../../../api/types";

type Props = {
  workflowId: string;
};

type LastRunInfo = {
  status: Status | "N/A";
  time: string | "N/A";
};

export function useWorkflowLastRunQuery({ workflowId }: Props) {
  const queryResult = useQuery<LastRunInfo | null>({
    queryKey: ["lastRunInfo", workflowId],
    queryFn: async () => {
      const client = await getClient(credentialGetter);
      const data = (await client
        .get(`/workflows/${workflowId}/runs?page_size=1`)
        .then((response) => response.data)) as Array<WorkflowRunApiResponse>;
      if (data.length === 0) {
        return {
          status: "N/A",
          time: "N/A",
        };
      }
      return {
        status: data[0]!.status,
        time: data[0]!.created_at,
      };
    },
  });

  return queryResult;
}
