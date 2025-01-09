"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { TaskResponse } from "mtmaiapi";
// import {
//   agentGetAgentTaskStepsOptions,
//   getTaskActionsOptions,
//   getTaskOptions,
// } from "mtmaiapi/@tanstack/react-query.gen";
import {
  type Action,
  type ActionApiResponse,
  ActionTypes,
  Status,
} from "../../../../api/types";
import { statusIsNotFinalized } from "../../types";

function getActionInput(action: ActionApiResponse) {
  let input = "";
  if (action.action_type === ActionTypes.InputText && action.text) {
    input = action.text;
  } else if (action.action_type === ActionTypes.Click) {
    input = "Click";
  } else if (action.action_type === ActionTypes.SelectOption && action.option) {
    input = action.option.label;
  }
  return input;
}

type Props = {
  taskId: string;
};

function isOld(task: TaskResponse) {
  return new Date(task.created_at) < new Date(2024, 9, 21);
}

export function useActions({ taskId }: Props): {
  data: Array<Action | null>;
  isLoading: boolean;
} {
  // const { data: task, isLoading: taskIsLoading } = useQuery<TaskApiResponse>({
  // 	queryKey: ["task", id],
  // 	queryFn: async () => {
  // 		const client = await getClient(credentialGetter);
  // 		return client.get(`/tasks/${id}`).then((response) => response.data);
  // 	},
  // 	refetchInterval: (query) => {
  // 		if (!query.state.data) {
  // 			return false;
  // 		}
  // 		if (statusIsNotFinalized(query.state.data)) {
  // 			return 5000;
  // 		}
  // 		return false;
  // 	},
  // 	placeholderData: keepPreviousData,
  // });

  const { data: task, isLoading: taskIsLoading } = useQuery({
    ...getTaskOptions({
      path: {
        task_id: taskId,
      },
    }),
    refetchInterval: (query) => {
      if (!query.state.data) {
        return false;
      }
      if (statusIsNotFinalized(query.state.data)) {
        return 5000;
      }
      return false;
    },
    placeholderData: keepPreviousData,
  });

  const taskIsNotFinalized = task && statusIsNotFinalized(task);

  // const { data: taskActions, isLoading: taskActionsIsLoading } = useQuery<
  // 	Array<ActionsApiResponse>
  // >({
  // 	queryKey: ["tasks", id, "actions"],
  // 	queryFn: async () => {
  // 		const client = await getClient(credentialGetter);
  // 		return client
  // 			.get(`/tasks/${id}/actions`)
  // 			.then((response) => response.data);
  // 	},
  // 	refetchInterval: taskIsNotFinalized ? 5000 : false,
  // 	placeholderData: keepPreviousData,
  // 	enabled: Boolean(task && !isOld(task)),
  // });

  const { data: taskActions, isLoading: taskActionsIsLoading } = useQuery({
    // ...getTaskActionsOptions({
    //   path: {
    //     task_id: taskId,
    //   },
    // }),
    refetchInterval: taskIsNotFinalized ? 5000 : false,
    placeholderData: keepPreviousData,
    enabled: Boolean(task && !isOld(task)),
  });

  // const { data: steps, isLoading: stepsIsLoading } = useQuery<
  // 	Array<StepApiResponse>
  // >({
  // 	queryKey: ["task", id, "steps"],
  // 	queryFn: async () => {
  // 		const client = await getClient(credentialGetter);
  // 		return client.get(`/tasks/${id}/steps`).then((response) => response.data);
  // 	},
  // 	enabled: Boolean(task && isOld(task)),
  // 	refetchOnWindowFocus: taskIsNotFinalized,
  // 	refetchInterval: taskIsNotFinalized ? 5000 : false,
  // 	placeholderData: keepPreviousData,
  // });

  const { data: steps, isLoading: stepsIsLoading } = useQuery({
    // ...agentGetAgentTaskStepsOptions({
    //   path: {
    //     task_id: taskId,
    //   },
    // }),
    enabled: Boolean(task && isOld(task)),
    refetchOnWindowFocus: taskIsNotFinalized,
    refetchInterval: taskIsNotFinalized ? 5000 : false,
    placeholderData: keepPreviousData,
  });

  const actions =
    task && isOld(task)
      ? steps?.flatMap((step) => {
          const actionsAndResults = step.output?.actions_and_results ?? [];

          const actions = actionsAndResults.map((actionAndResult, index) => {
            const action = actionAndResult[0];
            const actionResult = actionAndResult[1];
            if (actionResult.length === 0) {
              return null;
            }
            return {
              reasoning: action.reasoning,
              confidence: action.confidence_float,
              input: getActionInput(action),
              type: action.action_type,
              success: actionResult?.[0]?.success ?? false,
              stepId: step.step_id,
              index,
            };
          });
          return actions;
        })
      : taskActions?.map((action) => {
          return {
            reasoning: action.reasoning ?? "",
            confidence: action.confidence_float ?? undefined,
            input: action.response ?? "",
            type: action.action_type,
            success: action.status === Status.Completed,
            stepId: action.step_id ?? "",
            index: action.action_order ?? 0,
          };
        });

  return {
    data: actions ?? [],
    isLoading: taskIsLoading || taskActionsIsLoading || stepsIsLoading,
  };
}
