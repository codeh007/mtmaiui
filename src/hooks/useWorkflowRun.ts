"use client";

import { useState } from "react";
import { useTenant } from "./useAuth";
import { useMtmClient } from "./useMtmapi";

export const useWorkflowRunShape = (runId: string) => {
  const mtmapi = useMtmClient();
  const tenant = useTenant();
  const [errors, setErrors] = useState<string[]>([]);
  const shape = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/shape",
    {
      params: {
        path: {
          tenant: tenant!.metadata.id,
          "workflow-run": runId,
        },
      },
    },
    {
      refetchInterval: 2000,
    },
  );
  return { shape };
};
