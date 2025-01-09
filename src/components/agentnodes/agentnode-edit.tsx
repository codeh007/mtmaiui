"use client";

import { EditFormToolbar } from "mtxuilib/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { useTenant } from "../../hooks/useAuth";
import { useMtmClient } from "../../hooks/useMtmapi";

export const AgentNodeEditView = ({ id }: { id: string }) => {
  const mtmapi = useMtmClient();
  const tenant = useTenant();

  const agentNodeGetQuery = mtmapi.useSuspenseQuery(
    "get",
    "/api/v1/tenants/{tenant}/nodes/{node}",
    {
      params: { path: { tenant: tenant.metadata.id, node: id } },
    },
  );

  const form = useZodForm({
    schema: z.object({
      title: z.string().optional(),
      prompt: z.string().min(10),
      type: z.string().min(1),
      description: z.string().optional(),
    }),
    defaultValues: agentNodeGetQuery.data,
  });

  // const createAgentNodeMutation = mtmapi.useMutation(
  //   "post",
  //   "/api/v1/tenants/{tenant}/nodes",
  // );
  const updateAgentNodeMutation = mtmapi.useMutation(
    "patch",
    "/api/v1/tenants/{tenant}/nodes/{node}",
  );
  const handleFormSubmit = (values) => {
    updateAgentNodeMutation.mutate({
      params: {
        path: {
          tenant: tenant.metadata.id,
          node: id,
        },
      },
      body: values,
    });
  };
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={handleFormSubmit}
        className="flex flex-col space-y-2 px-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="网址" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>提示词</FormLabel>
              <FormControl>
                <Input placeholder="提示词" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>节点类型</FormLabel>
              <FormControl>
                <Input placeholder="节点类型" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Input placeholder="节点类型" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <EditFormToolbar form={form} />
      </ZForm>
    </>
  );
};
