"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  type FlowNames,
  agentNodeRunMutation,
  workflowGetOptions,
} from "mtmaiapi";
import { useTenant } from "../../hooks/useAuth";
import { AgentNodeSchemaForm } from "../agentnodes/flow-forms/AgentNodeSchemaForm";
import { OneShotDemoForm } from "../agentnodes/flow-forms/OneShotDemo";
import { ResearchForm } from "../agentnodes/flow-forms/ResearchForm";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

interface FlowFormsProps {
  workflowId: string;
  defaultValues?: any;
}
export const FlowForms = ({ workflowId, ...rest }: FlowFormsProps) => {
  const tenant = useTenant();
  const runMutation = useMutation({
    ...agentNodeRunMutation(),
  });

  const workflowQuery = useSuspenseQuery({
    ...workflowGetOptions({
      path: {
        workflow: workflowId,
      },
    }),
  });
  const workflowName = workflowQuery.data.name;
  const handleSubmit = (values) => {
    runMutation.mutate({
      path: {
        tenant: tenant.metadata.id,
      },
      body: {
        flowName: workflowName as FlowNames,
        params: {
          ...values,
        },
        isStream: false,
      },
    });
  };

  const WorrkFlowName = workflowQuery.data?.name;

  switch (WorrkFlowName) {
    case "research":
      return <ResearchForm onSubmit={handleSubmit} {...rest} />;
    case "oneShotDemo":
      return <OneShotDemoForm onSubmit={handleSubmit} {...rest} />;
    default:
      return (
        <MtSuspenseBoundary>
          <AgentNodeSchemaForm schema={workflowId} onSubmit={handleSubmit} />
        </MtSuspenseBoundary>
      );
  }
};
