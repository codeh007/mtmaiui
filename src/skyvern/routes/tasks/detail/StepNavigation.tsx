"use client";
import { CheckboxIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
// import { agentGetAgentTaskStepsOptions } from "mtmaiapi/@tanstack/react-query.gen";
import { cn } from "mtxuilib/lib/utils";
import { useSearchParams } from "next/navigation";

type Props = {
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  taskId: string;
};

export function StepNavigation({
  activeIndex,
  onActiveIndexChange,
  taskId,
}: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const {
    data: steps,
    isError,
    error,
  } = useQuery({
    // queryKey: ["task", taskId, "steps", page],
    // queryFn: async () => {
    //   return client
    //     .get(`/tasks/${taskId}/steps`, {
    //       params: {
    //         page,
    //         page_size: PAGE_SIZE,
    //       },
    //     })
    //     .then((response) => response.data);
    // },
    // ...agentGetAgentTaskStepsOptions({
    //   path: {
    //     task_id: taskId,
    //   },
    // }),
  });

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <nav className="flex flex-col gap-4">
      {steps?.map((step, index) => {
        const isActive = activeIndex === index;
        return (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            className={cn(
              "flex cursor-pointer items-center rounded-2xl px-6 py-2 hover:bg-primary-foreground",
              {
                "bg-primary-foreground": isActive,
              },
            )}
            key={step.step_id}
            onClick={() => {
              onActiveIndexChange(index);
            }}
          >
            {step.status === "completed" && (
              <CheckboxIcon className="mr-2 h-6 w-6 text-green-500" />
            )}
            {step.status === "failed" && (
              <CrossCircledIcon className="mr-2 h-6 w-6 text-red-500" />
            )}
            <span>
              {step?.retry_index > 0
                ? `Step ${step.order + 1} ( Retry ${step.retry_index} )`
                : `Step ${step.order + 1}`}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
