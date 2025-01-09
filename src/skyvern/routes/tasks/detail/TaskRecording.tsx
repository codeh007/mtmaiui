"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "mtxuilib/ui/skeleton";

export function TaskRecording({ taskId }: { taskId: string }) {
  const {
    data: recordingURL,
    isLoading: taskIsLoading,
    isError: taskIsError,
  } = useQuery({
    // queryKey: ["task", taskId, "recordingURL"],
    // queryFn: async () => {
    //   // const client = await getClient(credentialGetter);
    //   const task: TaskApiResponse = await client
    //     .get(`/tasks/${taskId}`)
    //     .then((response) => response.data);
    //   return getRecordingURL(task);
    // },
    ...getTaskOptions({
      path: {
        task_id: taskId as string,
      },
    }),
    refetchOnMount: true,
  });

  if (taskIsLoading) {
    return (
      <div className="mx-auto flex">
        <div className="h-[450px] w-[800px]">
          <Skeleton className="h-full" />
        </div>
      </div>
    );
  }

  if (taskIsError) {
    return <div>Error loading recording</div>;
  }

  return recordingURL ? (
    <div className="mx-auto flex">
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video width={800} height={450} src={recordingURL} controls />
    </div>
  ) : (
    <div>No recording available for this task</div>
  );
}
