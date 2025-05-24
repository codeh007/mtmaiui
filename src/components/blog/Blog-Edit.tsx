"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { blogGetOptions, blogUpdateMutation } from "mtmaiapi";

import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { useTenant } from "../../hooks/useAuth";

interface BlogEditViewProps {
  blogId: string;
}
export const BlogEditView = (props: BlogEditViewProps) => {
  const { blogId } = props;
  const tenant = useTenant();

  const blogQuery = useSuspenseQuery({
    ...blogGetOptions({
      path: {
        blog: blogId,
        tenant: tenant.metadata.id,
      },
    }),
  });

  const form = useZodForm({
    schema: z.any(),
    defaultValues: { ...blogQuery.data },
  });

  const saveBlog = useMutation({
    ...blogUpdateMutation({
      path: {
        blog: blogId,
        tenant: tenant.metadata.id,
      },
    }),
  });
  const handleFormSubmit = (values: any) => {
    saveBlog.mutate({
      path: {
        blog: blogId,
        tenant: tenant.metadata.id,
      },
      body: values,
    });
  };

  return (
    <>
      <ZForm
        form={form}
        className="flex flex-col space-x-2 p-1 w-full"
        handleSubmit={handleFormSubmit}
      >
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Input placeholder="标题" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      {/* <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Spinner />}
        Update Blog
      </Button> */}
      <ZFormToolbar form={form} />
    </>
  );
};
