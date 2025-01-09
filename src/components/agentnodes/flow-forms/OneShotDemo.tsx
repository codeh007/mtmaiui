"use client";

import { EditFormToolbar } from "mtxuilib/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";

interface OneShotDemoFormProps {
  defaultValues?: any;
  onSubmit: (values) => void;
}
export const OneShotDemoForm = ({
  onSubmit,
  defaultValues,
}: OneShotDemoFormProps) => {
  const form = useZodForm({
    schema: z.object({
      input: z.string(),
    }),
    defaultValues,
  });

  return (
    <ZForm
      form={form}
      handleSubmit={onSubmit}
      className="flex flex-col space-y-2 px-2"
    >
      <FormField
        control={form.control}
        name="input"
        render={({ field }) => (
          <FormItem>
            <FormLabel>input</FormLabel>
            <FormControl>
              <Input placeholder="input" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <EditFormToolbar form={form} />
    </ZForm>
  );
};
