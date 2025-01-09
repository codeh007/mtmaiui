"use client";

import { useCallback, useState } from "react";
import type { WorkflowRun } from "../types/hatchet-types";
import { useApiError } from "./useApi";
import { useTenant } from "./useAuth";
import { useBasePath } from "./useBasePath";
import { useMtmClient } from "./useMtmapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";

export const useWorkflow = (name: string) => {
  const mtmapi = useMtmClient();
  const tenant = useTenant();
  const router = useMtRouter();
  const basePath = useBasePath();
  const [errors, setErrors] = useState<string[]>([]);
  const [currentWorkflowRun, setCurrentWorkflowRun] =
    useState<WorkflowRun | null>(null);
  const { handleApiError } = useApiError({
    setErrors,
  });
  const currentWorkflow = mtmapi.useSuspenseQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflows/byName/{name}",
    {
      params: {
        path: {
          name: name,
          tenant: tenant.metadata.id,
        },
      },
    },
  );

  const triggerMutation = mtmapi.useMutation(
    "post",
    "/api/v1/workflows/{workflow}/trigger",
    {
      onSuccess: (data) => {
        setCurrentWorkflowRun(data);
        router.push(`${basePath}/workflow-runs/${data.metadata.id}?view=graph`);
      },
      onError: handleApiError,
      onMutate: () => {
        setErrors([]);
      },
    },
  );

  const trigger = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (input: Record<string, any>, additionalMetadata?: Record<string, any>) => {
      triggerMutation.mutate({
        params: {
          path: {
            workflow: currentWorkflow.data.metadata.id,
          },
        },
        body: {
          input: input as Record<string, never>,
          additionalMetadata: additionalMetadata as Record<string, never>,
        },
      });
    },
    [triggerMutation, currentWorkflow],
  );
  return { workflow: currentWorkflow, trigger, currentWorkflowRun };
};
