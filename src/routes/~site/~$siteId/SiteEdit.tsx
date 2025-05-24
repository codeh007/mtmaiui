"use client";

import { useQuery } from "@tanstack/react-query";
import { zUpdateSiteRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";

interface SiteEditProps {
  siteId: string;
}
export const SiteEdit = (props: SiteEditProps) => {
  const { siteId } = props;
  const { data } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetch(`/api/sites/${siteId}`).then((res) => res.json()),
  });
  const form = useZodFormV2({
    schema: zUpdateSiteRequest,
    toastValidateError: true,
    defaultValues: {},
    handleSubmit: (values) => {
      // handleHumanInput({
      //   // component: values as TeamComponent,
      //   // session_id: "123",
      //   // task: "告诉我,您能帮我做什么事情?",
      //   // init_state: {},
      //   type: AgentEventType.CHAT_MESSAGE_INPUT,
      //   content: "告诉我,您能帮我做什么事情?",
      // });
    },
  });

  return (
    <>
      <DebugValue data={data} />
      <ZForm {...form}>
        <h1>编辑站点</h1>
        <FormField
          control={form.form.control}
          name="title"
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
      </ZForm>
    </>
  );
};
