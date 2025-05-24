"use client";

import type { Workflow } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { useState } from "react";

import { TriggerWorkflowForm } from "./components/trigger-workflow-form";

interface WorkflowTriggerBtnProps {
  workflow: Workflow;
}
export const WorkflowTriggerBtn = ({ workflow }: WorkflowTriggerBtnProps) => {
  const [triggerWorkflow, setTriggerWorkflow] = useState(false);
  // const workflowQuery = useSuspenseQuery({
  //   ...workflowGetOptions({
  //     path: {
  //       workflow: workflow.metadata.id,
  //     },
  //   }),
  // });

  // const workflowName = workflowQuery.data?.name;

  return (
    <>
      <CustomLink
        to={`/workflows/${workflow.metadata.id}/trigger/${workflow.name}`}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Trigger
      </CustomLink>

      <TriggerWorkflowForm
        show={triggerWorkflow}
        defaultWorkflow={workflow}
        onClose={() => setTriggerWorkflow(false)}
      />
    </>
  );
};
