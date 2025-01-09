"use client";
import type { WorkflowRun } from "mtmaiapi/api";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";
import { MtLoading } from "mtxuilib/mt/mtloading";
import { useMtmClient } from "../../hooks/useMtmapi";

export function WorkflowRunInputDialog({ run }: { run: WorkflowRun }) {
  const mtmapi = useMtmClient();
  const getInputQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/input",
    {
      params: {
        path: {
          tenant: run.tenantId,
          "workflow-run": run.metadata.id,
        },
      },
    },
  );

  if (getInputQuery.isLoading) {
    return <MtLoading />;
  }

  if (!getInputQuery.data) {
    return null;
  }

  const input = getInputQuery.data;

  return (
    <CodeHighlighter
      className="my-4"
      language="json"
      code={JSON.stringify(input, null, 2)}
    />
  );
}
