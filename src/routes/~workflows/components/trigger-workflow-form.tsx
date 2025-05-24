"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Workflow } from "mtmaiapi";
import { workflowRunCreateMutation } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CodeEditor } from "mtxuilib/mt/code-editor";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import { useState } from "react";

type TimingOption = "now" | "schedule" | "cron";

export function TriggerWorkflowForm({
  defaultWorkflow,
  show,
  onClose,
  defaultTimingOption = "now",
}: {
  defaultWorkflow?: Workflow;

  show: boolean;
  onClose: () => void;
  defaultTimingOption?: TimingOption;
}) {
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

  return (
    <Dialog
      open={!!defaultWorkflow && show}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[625px] py-12">
        <DialogHeader>
          <DialogTitle>Trigger this workflow</DialogTitle>
          <DialogDescription>
            You can change the input to your workflow here.
          </DialogDescription>
        </DialogHeader>
        <div className="font-bold">Input</div>
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
                workflow: defaultWorkflow?.metadata.id,
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
      </DialogContent>
    </Dialog>
  );
}
