"use client";
import { useQuery } from "@tanstack/react-query";
// import { agentGetAgentTaskStepsOptions } from "mtmaiapi/@tanstack/react-query.gen";
import { useSearchParams } from "next/navigation";
import { StepArtifacts } from "./StepArtifacts";
import { StepNavigation } from "./StepNavigation";

interface StepArtifactsLayoutProps {
  taskId: string;
}

export function StepArtifactsLayout({ taskId }: StepArtifactsLayoutProps) {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step")) || 0;

  const {
    data: steps,
    isError,
    error,
  } = useQuery({
    // queryKey: ["task", taskId, "steps"],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   return client
    //     .get(`/tasks/${taskId}/steps`)
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

  const activeStep = steps?.[step];

  return (
    <div className="flex">
      <aside className="w-64 shrink-0">
        <StepNavigation
          taskId={taskId}
          activeIndex={step}
          onActiveIndexChange={(index) => {
            setSearchParams(
              (params) => {
                const newParams = new URLSearchParams(params);
                newParams.set("step", String(index));
                return newParams;
              },
              {
                replace: true,
              },
            );
          }}
        />
      </aside>
      <main className="w-full px-4">
        {activeStep ? (
          <StepArtifacts id={activeStep.step_id} stepProps={activeStep} />
        ) : null}
      </main>
    </div>
  );
}
