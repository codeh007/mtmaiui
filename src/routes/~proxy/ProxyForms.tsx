"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { proxyListQueryKey, proxyUpsertMutation } from "mtmaiapi";
// import { zProxyUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { generateUUID } from "mtxuilib/lib/utils";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { useTenantId } from "../../hooks/useAuth";
import { RootRoute } from "../~__root";
import { ProxySelect } from "./ProxySelect";

export function ProxyForm() {
  const tid = useTenantId();
  const queryClient = useQueryClient();
  const nav = RootRoute.useNavigate();
  const upsertProxyMutation = useMutation({
    ...proxyUpsertMutation({}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: proxyListQueryKey({
          path: {
            tenant: tid,
          },
        }),
      });
      nav({ to: `/proxy/${data.metadata?.id}` });
    },
  });
  const form = useZodFormV2({
    schema: zProxyUpsert,
    defaultValues: {
      name: "本机测试",
      description: "本机测试",
      url: "http://127.0.0.1:10809",
    },
    toastValidateError: true,
    handleSubmit: (values) => {
      upsertProxyMutation.mutate({
        path: {
          tenant: tid,
          proxy: generateUUID(),
        },
        body: {
          ...values,
        },
      });
    },
  });

  return (
    <>
      <ZForm {...form} className="space-y-2 px-2">
        <ProxyFormFields />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}

export const ProxyFormFields = () => {
  const form = useFormContext<z.infer<typeof zProxyUpsert>>();
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>description</FormLabel>
            <FormControl>
              <Input {...field} placeholder="name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>url</FormLabel>
            <FormControl>
              <Input {...field} placeholder="name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="proxyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>proxyId</FormLabel>
            <FormControl>
              <ProxySelect {...field} placeholder="proxyId" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
