"use client";

import { useMutation } from "@tanstack/react-query";
import { blogCreateOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CodeEditor } from "mtxuilib/mt/code-editor";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { z } from "zod";
import { BlogSelector } from "../../../../../components/blog/blog-selector";
import { useTenant, useUser } from "../../../../../hooks/useAuth";

const schema = z.object({
  blogId: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(8000),
  authorId: z.string().uuid(),
});

interface CreateEventFormProps {
  className?: string;
  blogId: string;
  authorId?: string;
  onSubmited?: () => void;
  onLoadingChange?: (isloading) => void;
  fieldErrors?: Record<string, string>;
}

export function CreateBlogPostForm({ className, ...props }: CreateEventFormProps) {
  const user = useUser();
  if (!user) throw new Error("user required");
  const [code, setCode] = useState<string | undefined>("{}");
  const [blogId, setBlogId] = useState<string>(props.blogId);
  const [authorId, setAuthorId] = useState<string>(props.authorId || user.metadata.id);

  const tenant = useTenant();
  const tid = tenant?.metadata.id;

  // const createBlogPostMutation = useMutation(
  //   "post",
  //   "/api/v1/tenants/{tenant}/posts",
  // );
  const createBlogPostMutation = useMutation({
    ...blogCreateOptions({}),
  });

  const form = useZodForm({
    schema: schema,
    defaultValues: {
      blogId: blogId,
      authorId: authorId,
    },
  });
  const handleSubmit = (values) => {
    console.log("handleSubmit", values);
    createBlogPostMutation.mutate({
      path: {
        tenant: tid,
      },
      body: {
        ...values,
        blogId,
        authorId,
      },
    });
  };
  return (
    <ZForm form={form} className="space-y-2" handleSubmit={handleSubmit}>
      <BlogSelector selectedBlogId={blogId} />
      <DebugValue data={{ user }} />
      <div className="grid gap-4">
        <div className="grid gap-2">
          {/* <Label htmlFor="email">title</Label>
          <Input
            {...register("title")}
            // id="api-token-key"
            placeholder="sample-event"
            autoCapitalize="none"
            autoCorrect="off"
            // disabled={props.isLoading}
          />
          {keyError && <div className="text-sm text-red-500">{keyError}</div>} */}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="标题" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <CodeEditor
                    code={code || ""}
                    setCode={(value) => {
                      setCode(value);

                      // if this is valid JSON, set it as the value
                      if (!value) {
                        // field.onChange({});
                        field.onChange("");
                        return;
                      }

                      try {
                        // field.onChange(JSON.parse(value));
                        field.onChange(value);
                      } catch (e) {} // eslint-disable-line no-empty
                    }}
                    language="markdown"
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {dataError && <div className="text-sm text-red-500">{dataError}</div>} */}
        </div>
        <Button type="submit">Create Blog</Button>
        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
      </div>
    </ZForm>
  );
}
