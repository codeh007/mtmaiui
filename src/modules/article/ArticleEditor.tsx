"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import {
  siteGetSiteOptions,
  siteSiteUpdateMutation,
} from "mtmaiapi/@tanstack/react-query.gen";

import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { Icons } from "mtxuilib/icons/icons";
import { toast } from "sonner";

export const EditorEditor = (props: DetailViewProps) => {
  const { item } = props;

  if (!item) {
    throw new Error("siteId is required");
  }
  const siteQuery = useSuspenseQuery({
    ...siteGetSiteOptions({
      path: {
        id: item.content_id,
      },
    }),
  });
  return (
    <>
      <ArticleEditorForm site={siteQuery.data} />
    </>
  );
};

const ArticleEditorForm = (props: { site: SiteItemPublic }) => {
  const { site } = props;

  const updateSiteMutation = useMutation({
    ...siteSiteUpdateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      toast.error("操作失败");
    },
  });
  const form = useZodForm({
    defaultValues: site,
  });

  const handleSubmit = (data: SiteItemPublic) => {
    updateSiteMutation.mutate({
      path: {
        id: site.id,
      },
      body: data,
    });
  };
  return (
    <ZForm
      form={form}
      handleSubmit={handleSubmit}
      className="flex flex-col space-y-2 px-2"
    >
      <div className="flex justify-end p-2 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <MtButton disabled={updateSiteMutation.isPending}>
              {updateSiteMutation.isPending ? (
                <Icons.reload className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              保存
            </MtButton>
          </TooltipTrigger>
          <TooltipContent>保存</TooltipContent>
        </Tooltip>
      </div>
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
              <Input placeholder="描述" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </ZForm>
  );
};
