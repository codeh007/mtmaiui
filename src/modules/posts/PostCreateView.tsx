"use client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useZodForm, ZForm } from "mtxuilib/form/ZodForm";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import { Button } from "mtxuilib/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "mtxuilib/ui/tabs";

import { toast } from "sonner";
import { z } from "zod";

export const PostCreateView = () => {
  // const { postId } = props;
  const postUpdateMutation = useMutation({
    // ...blogPostCreateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });

  const postQuery = useSuspenseQuery({
    // ...blogPostGetOptions({
    //   path: {
    //     slug_or_id: postId || "",
    //   },
    // }),
  });

  const post = postQuery?.data;

  const form = useZodForm({
    schema: z.any(),
    defaultValues: post,
  });
  return (
    <div>
      <DebugValue data={post} />
      <ZForm
        form={form}
        handleSubmit={(values) => {
          postUpdateMutation.mutate({
            body: {
              ...values,
            },
          });
        }}
        className="space-y-2"
      >
        <Tabs defaultValue="content" className="w-full h-full">
          <TabsList className="flex w-full gap-2">
            <div className="flex flex-1">
              {/* {props.goBackOptions && (
                <div className="mr-2">
                  <MtLink href={props.goBackOptions.path}>
                    {props.goBackOptions.label}
                  </MtLink>
                </div>
              )} */}
              <TabsTrigger value="content">文章</TabsTrigger>
              <TabsTrigger value="options">选项</TabsTrigger>
            </div>
            <div>
              <Button type="submit">保存</Button>
            </div>
          </TabsList>
          <TabsContent value="content">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input {...form.register("title")} placeholder="title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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

            <div className="min-h-4" />
            <div className="h-full mx-auto w-full">
              {/* <LzMtmEditor
                defaultValue={form.getValues().content}
                onValueChange={(html) => {
                  console.log("可视化编辑器提交", html);
                  form.setValue("content", html);
                }}
              /> */}
            </div>
          </TabsContent>
          <TabsContent value="options">111</TabsContent>
        </Tabs>
      </ZForm>
    </div>
  );
};
