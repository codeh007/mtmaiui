"use client";


import { EditFormToolbar } from "mtxuilib/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";

interface ResearchFormProps {
  defaultValues?: any;
  onSubmit: (values) => void;
}
export const ResearchForm = (props: ResearchFormProps) => {
  const form = useZodForm({
    defaultValues: props.defaultValues,
  });

  return (
    <ZForm form={form} handleSubmit={props.onSubmit}>
      <FormField
        control={form.control}
        name="input"
        render={({ field }) => (
          <FormItem>
            <FormLabel>input</FormLabel>
            <FormControl>
              <Input placeholder="输入" {...field} />
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
