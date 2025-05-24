import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
// import { resourceUpsertMutation } from "mtmaiapi";
// import { zResourceUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useTenantId } from "../../../../hooks/useAuth";
export const Route = createLazyFileRoute("/resource/new/res")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const resourceUpsert = useMutation({
    ...resourceUpsertMutation(),
  });
  const form = useZodFormV2({
    schema: zResourceUpsert,
    defaultValues: {},
    handleSubmit: (values) => {
      resourceUpsert.mutate({
        path: {
          tenant: tid,
        },
        body: {
          ...values,
          type: values.type,
        },
      });
    },
  });
  return (
    <>
      <ZForm {...form} className="space-y-2 h-full w-full px-2">
        <FormField
          control={form.form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Outlet />
        <ZFormToolbar form={form.form} />
      </ZForm>
    </>
  );
}
