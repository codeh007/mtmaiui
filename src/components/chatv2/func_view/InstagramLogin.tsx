"use client";

import type { Part } from "mtmaiapi";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

const zLoginFunctionResponse = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  otp_key: z.string().optional(),
  proxy_url: z.string().optional(),
});

interface InstagramLoginViewProps {
  part: Part;
}
export default function InstagramLoginView({ part }: InstagramLoginViewProps) {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const form = useZodFormV2({
    schema: zLoginFunctionResponse,
    defaultValues: {
      username: "",
      password: "",
      otp_key: "",
      proxy_url: "http://127.0.0.1:10809",
      //socks5://US-Illinois-pbfBnijAfc-172.59.190.194:myb398a6ewyqcc5w@172.235.39.216:8000
    },
    toastValidateError: true,
    handleSubmit: () => {
      handleHumanInput({
        role: "user",
        parts: [
          {
            function_response: {
              id: part.function_call!.id,
              name: part.function_call!.name,
              response: {
                username: form.form.getValues("username"),
                password: form.form.getValues("password"),
                otp_key: form.form.getValues("otp_key"),
                proxy_url: form.form.getValues("proxy_url"),
              },
            },
          },
        ],
      });
    },
  });
  return (
    <>
      <ZForm {...form}>
        {/* <input type="hidden" {...form.form.register("type")} /> */}
        <FormField
          control={form.form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
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
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input {...field} placeholder="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="otp_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>两步验证密钥</FormLabel>
              <FormControl>
                <Input {...field} placeholder="otp_key" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="proxy_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>代理地址</FormLabel>
              <FormControl>
                <Input {...field} placeholder="socks5://127.0.0.1:9090" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}
