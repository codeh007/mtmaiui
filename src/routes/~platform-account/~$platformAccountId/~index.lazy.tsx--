"use client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { platformAccountGetOptions, platformAccountUpsertMutation } from "mtmaiapi";
// import { zPlatformAccountUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { JsonObjectInput } from "mtxuilib/mt/inputs/JsonObjectInput";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useToast } from "mtxuilib/ui/use-toast";
import { useEffect } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { ProxySelect } from "../../~proxy/ProxySelect";
export const Route = createLazyFileRoute("/platform-account/$platformAccountId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  const tid = useTenantId();
  const toast = useToast();
  const query = useSuspenseQuery({
    ...platformAccountGetOptions({
      path: {
        tenant: tid,
        platform_account: platformAccountId,
      },
    }),
  });

  const updatePlatformAccountMutation = useMutation({
    ...platformAccountUpsertMutation(),
    onSuccess: () => {
      toast.toast({
        title: "操作成功",
      });
    },
  });
  const form = useZodFormV2({
    schema: zPlatformAccountUpsert,
    defaultValues: query.data,
    toastValidateError: true,
    handleSubmit: (values) => {
      updatePlatformAccountMutation.mutate({
        path: {
          tenant: tid!,
          platform_account: platformAccountId,
        },
        body: values,
      });
    },
  });
  useEffect(() => {
    if (query.data) {
      form.form.reset(query.data);
    }
  }, [query.data, form.form]);

  return (
    <>
      <ZForm {...form} className="space-y-2 px-2">
        <FormField
          control={form.form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="type" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>platform</FormLabel>
              <FormControl>
                <Input {...field} placeholder="platform" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>tags</FormLabel>
              <FormControl>
                <TagsInput {...field} placeholder="tags" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={"state"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>state</FormLabel>
              <FormControl>
                <JsonObjectInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="proxyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>proxyId(未完成)</FormLabel>
              <FormControl>
                <ProxySelect {...field} placeholder="proxyId" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DebugValue data={{ data: query.data, form: form.form.getValues() }} />
        <ZFormToolbar form={form.form} />
      </ZForm>
    </>
  );
}
