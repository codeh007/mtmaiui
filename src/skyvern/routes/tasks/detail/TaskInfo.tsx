"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Badge } from "lucide-react";
import { client } from "mtmaiapi";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { Status, type StepApiResponse } from "../../../api/types";
import { StatusBadge } from "../../../components/StatusBadge";
import { useTaskQuery } from "./hooks/useTaskQuery";

type Props = {
  id: string;
};

const formatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TaskInfo({ id }: Props) {
  const costCalculator = useCostCalculator();
  const {
    data: task,
    isLoading: taskIsLoading,
    isError: taskIsError,
  } = useTaskQuery({ id });

  const taskIsRunningOrQueued =
    task?.status === Status.Running || task?.status === Status.Queued;

  const {
    data: steps,
    isLoading: stepsIsLoading,
    isError: stepsIsError,
  } = useQuery<Array<StepApiResponse>>({
    queryKey: ["task", id, "steps"],
    queryFn: async () => {
      // const client = await getClient(credentialGetter);
      return client.get(`/tasks/${id}/steps`).then((response) => response.data);
    },
    refetchOnWindowFocus: taskIsRunningOrQueued,
    refetchInterval: taskIsRunningOrQueued ? 5000 : false,
    placeholderData: keepPreviousData,
  });

  if (stepsIsLoading || taskIsLoading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    );
  }

  if (stepsIsError || taskIsError) {
    return null;
  }

  const actionCount = steps?.reduce((acc, step) => {
    const actionsAndResults = step.output?.actions_and_results ?? [];

    const actionCount = actionsAndResults.reduce((acc, actionAndResult) => {
      const actionResult = actionAndResult[1];
      if (actionResult.length === 0) {
        return acc;
      }
      return acc + 1;
    }, 0);
    return acc + actionCount;
  }, 0);

  const showCost = typeof costCalculator === "function";
  const notRunningSteps = steps?.filter((step) => step.status !== "running");

  return (
    <div className="flex gap-4">
      {task && <StatusBadge status={task.status} />}
      <Badge>Steps: {notRunningSteps?.length}</Badge>
      <Badge>Actions: {actionCount}</Badge>
      {showCost && (
        <Badge>Cost: {formatter.format(costCalculator(steps ?? []))}</Badge>
      )}
    </div>
  );
}
