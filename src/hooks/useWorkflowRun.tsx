"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { workflowRunCreateMutation, workflowRunGetShapeOptions } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useCallback, useState } from "react";
import { Route } from "../routes/~__root";
import { useTenantId } from "./useAuth";
export const useWorkflowRunShape = (runId: string) => {
  const tid = useTenantId();
  const shape = useSuspenseQuery({
    ...workflowRunGetShapeOptions({
      path: {
        tenant: tid,
        "workflow-run": runId,
      },
    }),
    refetchInterval: 2000,
  });

  //原因: 后端的 shape 没有 jobRuns 字段,(因递归问题)
  //     这里通过二次查询获取这个字段
  // const stepRuns = useQuery({
  //   ...workflowRunGetOptions({
  //     path: {
  //       tenant: tid,
  //       "workflow-run": runId,
  //     },
  //   }),
  // });
  // if(shape.data && stepRuns.data!.jobRuns){
  //   shape.data!.jobRuns = stepRuns.data!.jobRuns
  // }
  return { shape };
};

export const useWorkflowRun = (workflowName: string, payload: any) => {
  const toast = useToast();

  const [workflowRunData, setWorkflowRunData] = useState<any>(null);
  const nav = Route.useNavigate();
  const handleShow = useCallback(
    (runId: string) => {
      nav({ to: `/workflow-runs/${runId}` });
    },
    [nav],
  );
  const workflowRunMutation = useMutation({
    ...workflowRunCreateMutation({
      path: {
        workflow: workflowName,
      },
      body: {
        input: payload,
      },
    }),
    onSuccess: (data) => {
      setWorkflowRunData(data);
      toast.toast({
        title: "工作流启动",
        description: (
          <div>
            <Button onClick={() => handleShow(data.metadata.id)}>查看</Button>
          </div>
        ),
      });
    },
    onError: (error) => {
      toast.toast({
        title: "启动工作流失败",
        description: <div>{error.errors.map((e) => e.description)}</div>,
      });
    },
  });

  const handleRun = useCallback(() => {
    workflowRunMutation.mutate({
      path: {
        workflow: workflowName,
      },
      body: {
        input: payload,
      },
    });
  }, [workflowRunMutation, workflowName, payload]);
  return { workflowRunMutation, handleRun, workflowRunData };
};
