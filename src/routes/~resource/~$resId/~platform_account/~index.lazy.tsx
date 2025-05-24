import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
// import { resourceGetOptions, resourceListOptions, resourceUpsertMutation } from "mtmaiapi";
// import { zResourceUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useToast } from "mtxuilib/ui/use-toast";
import { useTenantId } from "../../../../hooks/useAuth";
import { PlatformAccountFields } from "../../fields/PlatformAccountFields";

export const Route = createLazyFileRoute("/resource/$resId/platform_account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const { resId } = Route.useParams();
  const toast = useToast();
  const queryClient = useQueryClient();
  // const resourceUpsert = useMutation({
  //   ...resourceUpsertMutation(),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       ...resourceListOptions({
  //         path: {
  //           tenant: tid,
  //         },
  //       }),
  //     });
  //     toast.toast({
  //       title: "保存成功",
  //     });
  //   },
  // });

  const resourceGetQuery = useSuspenseQuery({
    ...resourceGetOptions({
      path: {
        tenant: tid,
        resource: resId,
      },
    }),
  });
  const form = useZodFormV2({
    schema: zResourceUpsert,
    defaultValues: {
      ...resourceGetQuery.data,
    },
    toastValidateError: true,
    handleSubmit: (values) => {
      resourceUpsert.mutate({
        path: {
          tenant: tid,
        },
        body: {
          ...values,
          type: "platform_account",
        },
      });
    },
  });
  return (
    <>
      <h1>社交媒体账号</h1>
      <ZForm {...form} className="space-y-2 px-2">
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

        <PlatformAccountFields />
        <ZFormToolbar form={form.form} />
      </ZForm>
    </>
  );
}
