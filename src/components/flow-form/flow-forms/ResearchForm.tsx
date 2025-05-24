"use client";

import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";

interface ResearchFormProps {
  defaultValues?: any;
  onSubmit: (values) => void;
}
export const ResearchForm = (props: ResearchFormProps) => {
  const form = useZodForm({
    defaultValues: props.defaultValues,
  });

  return (
    <>
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
    
        <ZFormToolbar form={form} />
    </ZForm>
    </>
  );
};
