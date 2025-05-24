import type { zFlowPlatformAccountLoginInput } from "mtmaiapi/gomtmapi/zod.gen.js";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

export function SocialLoginFields() {
  const form = useFormContext<z.infer<typeof zFlowPlatformAccountLoginInput>>();
  return (
    <>
      <FormField
        control={form.control}
        name="platform_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>平台名称</FormLabel>
            <FormControl>
              <Input {...field} placeholder="平台名称" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>username</FormLabel>
            <FormControl>
              <Input {...field} placeholder="username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>password</FormLabel>
            <FormControl>
              <Input {...field} placeholder="password" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="two_factor_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>两步验证码</FormLabel>
            <FormControl>
              <Input {...field} placeholder="两步验证码" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="two_factor_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>两步验证密钥</FormLabel>
            <FormControl>
              <Input {...field} placeholder="两步验证密钥" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="proxy_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>代理地址</FormLabel>
            <FormControl>
              <Input {...field} placeholder="代理地址" />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
