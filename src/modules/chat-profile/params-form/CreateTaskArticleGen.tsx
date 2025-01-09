"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  tasksCreateArticleTaskParamsOptions,
  tasksCreateMttaskMutation,
} from "mtmaiapi/@tanstack/react-query.gen";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { SiteInput } from "../../site/SiteInput";

interface CreateTaskArticleGenProps {
  prompt: string;
}
/**
 * 文章生成任务的参数配置
 */
export const CreateTaskArticleGen = ({ prompt }: CreateTaskArticleGenProps) => {
  const { data } = useQuery({
    ...tasksCreateArticleTaskParamsOptions({
      body: {
        prompt,
      },
    }),
  });

  const formData = data;
  return (
    <>
      <DebugValue data={data} />
      {formData && <CreateTaskArticleGenForm defaultValues={formData} />}
    </>
  );
};

interface CreateTaskArticleGenFormProps {
  defaultValues: ArticleGenTaskInputs;
}
const CreateTaskArticleGenForm = (props: CreateTaskArticleGenFormProps) => {
  const { defaultValues } = props;
  const router = useMtRouter();
  const form = useZodForm({
    defaultValues,
  });

  const createTask = useMutation({
    ...tasksCreateMttaskMutation(),
  });

  const handleSubmit = async (data) => {
    // console.log(data);
    const result = await createTask.mutateAsync({
      body: { ...data, task_type: "articleGen" },
    });
    if (result.task_id) {
      router.push(`/dash/chat/mttasks/${result.task_id}`);
    }
  };

  return (
    <ZForm form={form} handleSubmit={handleSubmit}>
      <FormField
        control={form.control}
        name="params.agent_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>智能体</FormLabel>
            <FormControl>
              <Input placeholder="智能体" {...field} />
            </FormControl>
            <FormDescription>
              智能体名称，用于区分不同的自动化操作
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="params.site_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>站点</FormLabel>
            <FormControl>
              <SiteInput placeholder="站点" {...field} />
            </FormControl>
            <FormDescription>站点，用于指定自动化操作的站点</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="params.limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>限定数量</FormLabel>
            <FormControl>
              <Input placeholder="限定数量" {...field} />
            </FormControl>
            <FormDescription>
              批量执行时，生成新文章的数据到达限定数量后，自动停止执行，
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="site_auto_config.prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>额外提示词</FormLabel>
            <FormControl>
              <Input placeholder="用人民日报的风格生成文章" {...field} />
            </FormControl>
            <FormDescription>提示词，用于描述自动化操作</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <MtButton type="submit">创建任务</MtButton>
    </ZForm>
  );
};
