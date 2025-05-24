import type { AskUserFunctionCall, FormField, FunctionCall } from "mtmaiapi";
import { AgentEventType } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormDescription,
  FormField as FormFieldV2,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const AskUserMessage = ({ msg }: { msg: FunctionCall }) => {
  const fcForm: AskUserFunctionCall = JSON.parse(msg.arguments);
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);

  const form = useZodFormV2({
    schema: z.any(),
    defaultValues: {
      // name: "John",
      // age: 30
    },
    handleSubmit: (values) => {
      console.log("values", values);
      handleHumanInput({
        ...values,
        type: AgentEventType.ASK_USER_FUNCTION_CALL_INPUT,
      });
    },
  });
  return (
    <div className="p-1 border bg-yellow-100">
      AskUserMessage form
      <DebugValue
        data={{
          msg,
          fcForm,
        }}
      />
      <ZForm {...form} className="space-y-2">
        <h1>{fcForm.title}</h1>
        <JsonFormFieldsView formFields={fcForm.fields || []} />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </div>
  );
};

export const JsonFormFieldsView = ({
  formFields,
}: { formFields: FormField[] }) => {
  const form = useFormContext();
  return (
    <div className="">
      <DebugValue data={{ formFields }} />
      {formFields.map((formField, index) => {
        return (
          <FormFieldV2
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            control={form.control}
            name={formField.name || "missing_field_name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formField.label}</FormLabel>
                <FormControl>
                  <Input placeholder={formField.placeholder} {...field} />
                </FormControl>
                {formField.description && (
                  <FormDescription>{formField.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
};
