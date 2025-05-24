"use client";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { workflowGetOptions, workflowRunCreateMutation } from "mtmaiapi";

import { cn } from "mtxuilib/lib/utils";
import { CodeEditor } from "mtxuilib/mt/code-editor";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowId } = Route.useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState<string | undefined>("{}");
  const [addlMeta, setAddlMeta] = useState<string | undefined>("{}");
  const [errors, setErrors] = useState<string[]>([]);

  const triggerWorkflowMutation = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (data) => {
      navigate({
        to: `/workflow-runs/${data.metadata.id}`,
        params: {
          workflowRunId: data.metadata.id,
        },
      });
    },
    // onError: handleApiError,
    onMutate: () => {
      setErrors([]);
    },
  });

  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflowId,
      },
    }),
  });

  const workflow = workflowQuery.data;
  return (
    <>
      <CodeEditor
        code={input || "{}"}
        setCode={setInput}
        language="json"
        height="180px"
      />
      <div className="font-bold">Additional Metadata</div>
      <CodeEditor
        code={addlMeta || "{}"}
        setCode={setAddlMeta}
        height="90px"
        language="json"
      />
      <Button
        className="w-fit"
        disabled={triggerWorkflowMutation.isPending}
        onClick={() => {
          const inputObj = JSON.parse(input || "{}");
          const addlMetaObj = JSON.parse(addlMeta || "{}");
          triggerWorkflowMutation.mutate({
            path: {
              // tenant: tenant!.metadata.id,
              workflow: workflow.metadata.id,
            },
            body: {
              input: inputObj,
              additionalMetadata: addlMetaObj,
            },
          });
        }}
      >
        <PlusIcon
          className={cn(
            triggerWorkflowMutation.isPending ? "rotate-180" : "",
            "h-4 w-4 mr-2",
          )}
        />
        Trigger
      </Button>
      {errors.length > 0 && (
        <div className="mt-4">
          {errors.map((error, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="text-red-500 text-sm">
              {error}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
