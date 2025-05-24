"use client";

import { useMutation } from "@tanstack/react-query";
import { type FlowNames, workflowRunCreateMutation } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { type PropsWithChildren, useEffect } from "react";
import { Route } from "../../routes/~__root";

interface FlowFormProps {
  workflowName: FlowNames;
  className?: string;
}

export default function FlowForm({
  workflowName,
  children,
  className,
}: PropsWithChildren<FlowFormProps>) {
  const nav = Route.useNavigate();
  const toast = useToast();

  const handleNavToWorkflowRun = (id: string) => {
    nav({
      to: `/workflow-runs/${id}`,
    });
  };

  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
    onSuccess: (resp) => {
      toast.toast({
        title: "Workflow run created",
        description: (
          <div>
            <Button onClick={() => handleNavToWorkflowRun(resp?.metadata?.id)}>
              View Workflow
            </Button>
          </div>
        ),
      });
    },
    onError: (error) => {
      toast.toast({
        title: "操作失败",
        description: error.errors.join(","),
      });
    },
    onMutate: () => {
      toast.toast({
        title: "处理中",
        description: "触发 workflow 中",
      });
    },
  });
  const form = useZodFormV2({
    schema: zAgEvent,
    defaultValues: {
      content: "hello",
    },
    toastValidateError: true,
    handleSubmit: (values) => {
      console.log("values", values);
      workflowRunCreate.mutate({
        path: {
          workflow: workflowName,
        },
        body: {
          input: values,
        },
      });
    },
  });

  const handleDownload = () => {
    const formValues = form.form.getValues();
    const formJson = JSON.stringify(formValues);
    const blob = new Blob([formJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form.json";
    a.click();
  };

  const handleImport = () => {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          // 将JSON数据填充到表单中
          form.form.reset(jsonData);
          toast.toast({
            title: "导入成功",
            description: "表单数据已成功导入",
          });
        } catch (error) {
          toast.toast({
            title: "导入失败",
            description: "无法解析JSON文件",
          });
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  useEffect(() => {
    const subscription = form.form.watch((value, { name, type }) => console.log(value, name, type));
    return () => subscription.unsubscribe();
  }, [form.form.watch]);

  return (
    <ZForm {...form} className={cn("flex flex-col gap-4 px-2", className)}>
      {children}
      <ZFormToolbar form={form.form} />
      <div className="flex justify-end gap-2 mr-2">
        <Button type="button" onClick={handleDownload}>
          下载
        </Button>
        <Button type="button" onClick={handleImport}>
          导入
        </Button>
      </div>
    </ZForm>
  );
}
