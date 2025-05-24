"use client";

import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { z } from "zod";

export default function DemoRunCodeForm() {
  const [taskResponse, setTaskResponse] = useState<string>("");
  const runSandboxAgent = async (task: string) => {
    const response = await fetch("/api/sandbox/run/agent", {
      method: "POST",
      body: JSON.stringify({ task }),
    });
    const data: any = await response.json();
    setTaskResponse(data);
  };

  const form = useZodFormV2({
    defaultValues: {
      task: "请自我介绍,你能做什么?",
    },
    schema: z.object({
      task: z.string().min(1),
    }),
    toastValidateError: true,
    handleSubmit: async (values) => {
      console.log(values);
      await runSandboxAgent(values.task);
    },
  });
  return (
    <>
      <ZForm {...form}>
        <pre>{JSON.stringify(taskResponse, null, 2)}</pre>
        <FormField
          control={form.form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>task</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="task"
                  // type="number"
                  // {...form.form.register("task", { valueAsNumber: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}
