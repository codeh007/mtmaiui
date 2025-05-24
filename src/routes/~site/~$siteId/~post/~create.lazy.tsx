"use client";
import { useMutation } from "@tanstack/react-query";
import { postCreateMutation } from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";

import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ZForm, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import { Button } from "mtxuilib/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { useToast } from "mtxuilib/ui/use-toast";
import { z } from "zod";

export const Route = createLazyFileRoute("/site/$siteId/post/create")({
  component: CreatePostRouteComponent,
});

function CreatePostRouteComponent() {
  const { siteId } = Route.useParams();
  const tid = useTenantId();
  const { toast } = useToast();
  const postUpdateMutation = useMutation({
    // ...blogPostCreateMutation(),
    onSuccess: (data) => {
      toast({
        title: "操作成功",
      });
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });
  const createPostMutation = useMutation({
    ...postCreateMutation(),
    onSuccess: (data) => {
      toast({
        title: "操作成功",
      });
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });

  const zform = useZodFormV2({
    schema: z.any(),
    // defaultValues: post,
    toastValidateError: true,
    handleSubmit: (values) => {
      createPostMutation.mutate({
        path: {
          tenant: tid,
        },
        body: {
          ...values,
          siteId: siteId,
        },
      });
    },
  });
  return (
    <>
      <ZForm
        {...zform}
        handleSubmit={(values) => {
          createPostMutation.mutate({
            path: {
              tenant: tid,
            },
            body: {
              ...values,
              siteId: siteId,
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
              control={zform.form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={zform.form.control}
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
            <FormField
              control={zform.form.control}
              name="slug"
              render={({ field }) => <Input {...field} placeholder="slug" />}
            />

            <div className="min-h-4" />
            <div className="h-full mx-auto w-full">
              <textarea
                className="w-full h-full"
                value={zform.form.getValues().content}
                onChange={(e) => {
                  zform.form.setValue("content", e.target.value);
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="options">not implemented</TabsContent>
        </Tabs>
      </ZForm>
    </>
  );
}
