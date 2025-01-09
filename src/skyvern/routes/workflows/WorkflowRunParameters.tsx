"use client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { RunWorkflowForm } from "./RunWorkflowForm";
interface WorkflowRunParametersProps {
  workflowPermanentId: string;
}
export function WorkflowRunParameters(props: WorkflowRunParametersProps) {
  const { workflowPermanentId } = props;
  const { data: workflow, isFetching } = useQuery({
    ...getWorkflowOptions({
      path: {
        workflow_permanent_id: workflowPermanentId,
      },
    }),
  });

  const workflowParameters = workflow?.workflow_definition.parameters.filter(
    (parameter) => parameter.parameter_type === "workflow",
  );
  const initialValues = workflowParameters?.reduce(
    (acc, curr) => {
      if (curr.workflow_parameter_type === "json") {
        if (typeof curr.default_value === "string") {
          acc[curr.key] = curr.default_value;
          return acc;
        }
        if (curr.default_value) {
          acc[curr.key] = JSON.stringify(curr.default_value, null, 2);
          return acc;
        }
      }
      if (curr.default_value && curr.workflow_parameter_type === "boolean") {
        acc[curr.key] = Boolean(curr.default_value);
        return acc;
      }
      if (
        curr.default_value === null &&
        curr.workflow_parameter_type === "string"
      ) {
        acc[curr.key] = "";
        return acc;
      }
      if (curr.default_value) {
        acc[curr.key] = curr.default_value;
        return acc;
      }
      acc[curr.key] = null;
      return acc;
    },
    {} as Record<string, unknown>,
  );

  if (isFetching) {
    return (
      <div className="space-y-8">
        <header className="space-y-5">
          <h1 className="text-3xl">Run Parameters</h1>
          <h2 className="text-lg text-slate-400">
            Fill the placeholder values that you have linked throughout your
            workflow.
          </h2>
        </header>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!workflow || !workflowParameters || !initialValues) {
    return <div>Workflow not found</div>;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-5">
        <h1 className="text-3xl">Run Parameters</h1>
        <h2 className="text-lg text-slate-400">
          Fill the placeholder values that you have linked throughout your
          workflow.
        </h2>
      </header>
      <RunWorkflowForm
        initialValues={initialValues}
        workflowParameters={workflowParameters}
        workflowPermanentId={workflowPermanentId}
      />
    </div>
  );
}
