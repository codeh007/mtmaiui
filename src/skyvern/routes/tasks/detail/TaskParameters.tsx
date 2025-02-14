"use client";
import { useQuery } from "@tanstack/react-query";
import { AutoResizingTextarea } from "mtxuilib/components/AutoResizingTextarea";
import { Input } from "mtxuilib/ui/input";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { CodeEditor } from "../../workflows/components/CodeEditor";

export function TaskParameters({ taskId }: { taskId: string }) {
  const {
    data: task,
    isLoading: taskIsLoading,
    isError: taskIsError,
  } = useQuery({
    // queryKey: ["task", taskId],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   return client.get(`/tasks/${taskId}`).then((response) => response.data);
    // },
    ...getTaskOptions({
      path: {
        task_id: taskId as string,
      },
    }),
  });

  if (taskIsLoading) {
    return (
      <div className="h-[40rem]">
        <Skeleton className="h-full" />
      </div>
    );
  }

  if (taskIsError || !task) {
    return <div>Error loading parameters</div>;
  }

  return (
    <section className="space-y-8 rounded-lg bg-slate-elevation3 px-6 py-5">
      <div className="flex gap-16">
        <div className="w-72">
          <h1 className="text-lg">URL</h1>
          <h2 className="text-base text-slate-400">
            The starting URL for the task
          </h2>
        </div>
        <Input value={task.request.url} readOnly />
      </div>
      <div className="flex gap-16">
        <div className="w-72">
          <h1 className="text-lg">Navigation Goal</h1>
          <h2 className="text-base text-slate-400">
            Where should Skyvern go and what should Skyvern do?
          </h2>
        </div>
        <AutoResizingTextarea
          value={task.request.navigation_goal ?? ""}
          readOnly
        />
      </div>
      <div className="flex gap-16">
        <div className="w-72">
          <h1 className="text-lg">Navigation Payload</h1>
          <h2 className="text-base text-slate-400">
            Specify important parameters, routes, or states
          </h2>
        </div>
        <CodeEditor
          className="w-full"
          language="json"
          value={
            typeof task.request.navigation_payload === "object"
              ? JSON.stringify(task.request.navigation_payload, null, 2)
              : task.request.navigation_payload
          }
          readOnly
          minHeight="96px"
          maxHeight="500px"
        />
      </div>
      <div className="flex gap-16">
        <div className="w-72">
          <h1 className="text-lg">Data Extraction Goal</h1>
          <h2 className="text-base text-slate-400">
            What outputs are you looking to get?
          </h2>
        </div>
        <AutoResizingTextarea
          value={task.request.data_extraction_goal ?? ""}
          readOnly
        />
      </div>
      <div className="flex gap-16">
        <div className="w-72">
          <h1 className="text-lg">Data Schema</h1>
          <h2 className="text-base text-slate-400">
            Specify the output format in JSON
          </h2>
        </div>
        <CodeEditor
          className="w-full"
          language="json"
          value={
            typeof task.request.extracted_information_schema === "object"
              ? JSON.stringify(
                  task.request.extracted_information_schema,
                  null,
                  2,
                )
              : task.request.extracted_information_schema
          }
          readOnly
          minHeight="96px"
          maxHeight="500px"
        />
      </div>
    </section>
  );
}
