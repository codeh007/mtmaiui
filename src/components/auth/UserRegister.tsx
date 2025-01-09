"use client";
import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import Link from "next/link";
import { z } from "zod";
import { useMtmClient } from "../../hooks";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
export function UserRegisterScreen() {
  const mtmai = useMtmClient();

  const register = mtmai.useMutation("post", "/api/v1/users/register");
  const form = useZodForm({
    schema: z.any(),
    defaultValues: {},
  });

  const handleSubmit = (values) => {
    register.mutate({
      body: values,
    });
  };
  return (
    <div className="mx-auto max-w-md w-full">
      <div className="prose">注册新用户</div>
      <ZForm form={form} className="space-y-2" handleSubmit={handleSubmit}>
        <Input type="email" placeholder="邮箱" {...form.register("email")} />
        <Input
          type="password"
          placeholder="密码"
          {...form.register("password")}
        />
        <Input
          type="password"
          placeholder="重复密码"
          {...form.register("password-repeat")}
        />
        <div className="flex items-center justify-between" />
        <Button type="submit" className="w-full">
          注册
        </Button>

        <Button type="submit" className="w-full" variant={"ghost"}>
          已有账号？ <Link href={"/auth/login"}>登录</Link>
        </Button>
      </ZForm>
      <footer className="py-3">
        <div className="prose text-center">
          © Mtm ltd. {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
