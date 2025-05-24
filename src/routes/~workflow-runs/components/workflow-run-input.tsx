"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type WorkflowRun, workflowRunGetInputOptions } from "mtmaiapi";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";

export function WorkflowRunInputDialog({ run }: { run: WorkflowRun }) {
  const getInputQuery = useSuspenseQuery({
    ...workflowRunGetInputOptions({
      path: {
        tenant: run.tenantId,
        "workflow-run": run.metadata.id,
      },
    }),
  });

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
