"use client";
import { useLoginHandler } from "@mtmaiui/hooks/useAuth";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export function LoginWithCreddents() {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const form = useZodForm({
    schema: schema,
    defaultValues: {},
  });
  const { loginHandler, isPending } = useLoginHandler();
  return (
    <div className="mx-auto max-w-md w-full">
      <div className="prose text-center">账号密码登录</div>
      <ZForm form={form} className="space-y-2" handleSubmit={loginHandler}>
        <Input type="email" placeholder="邮箱" {...form.register("email")} />
        <Input type="password" placeholder="密码" {...form.register("password")} />
        <div className="flex items-center justify-between" />
        <Button
          // isSuccessful={isSuccessful}
          className="w-full"
          // pending={isPending}
          disabled={isPending}
        >
          登录
        </Button>
      </ZForm>

      <p className="px-8 text-center text-sm ">
        <CustomLink className={cn(buttonVariants({ variant: "ghost" }))} to={"/auth/register"}>
          {/* Don&apos;t have an account? Sign Up */}
          没有账号？ 注册一个
        </CustomLink>
      </p>
      <footer className="py-3">
        <div className="prose text-center">© Mtmai. {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
