"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "mtmaiapi";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "mtxuilib/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Separator } from "mtxuilib/ui/separator";
import { Textarea } from "mtxuilib/ui/textarea";
import { toast } from "mtxuilib/ui/use-toast";
import { useId, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { stringify as convertToYAML } from "yaml";
import type { TaskApiResponse } from "../../../api/types";
import {
  type TaskTemplateFormValues,
  taskTemplateFormSchema,
} from "../create/TaskTemplateFormSchema";

function createTaskTemplateRequestObject(
  values: TaskTemplateFormValues,
  task: TaskApiResponse,
) {
  return {
    title: values.title,
    description: values.description,
    is_saved_task: true,
    webhook_callback_url: task.request.webhook_callback_url,
    proxy_location: task.request.proxy_location,
    workflow_definition: {
      parameters: [
        {
          parameter_type: "workflow",
          workflow_parameter_type: "json",
          key: "navigation_payload",
          default_value: JSON.stringify(task.request.navigation_payload),
        },
      ],
      blocks: [
        {
          block_type: "task",
          label: values.title,
          url: task.request.url,
          navigation_goal: task.request.navigation_goal,
          data_extraction_goal:
            task.request.data_extraction_goal === ""
              ? null
              : task.request.data_extraction_goal,
          data_schema:
            task.request.extracted_information_schema === ""
              ? null
              : task.request.extracted_information_schema,
        },
      ],
    },
  };
}

type Props = {
  task: TaskApiResponse;
};

export function TaskActions({ task }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const queryClient = useQueryClient();
  const router = useMtRouter();
  const form = useForm<TaskTemplateFormValues>({
    resolver: zodResolver(taskTemplateFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TaskTemplateFormValues) => {
      const request = createTaskTemplateRequestObject(values, task);
      // const client = await getClient(credentialGetter);
      const yaml = convertToYAML(request);
      return client
        .post("/workflows", yaml, {
          headers: {
            "Content-Type": "text/plain",
          },
        })
        .then((response) => response.data);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "There was an error while saving changes",
        description: error.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Template saved",
        description: "Template saved successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
      setOpen(false);
    },
  });

  function handleSubmit(values: TaskTemplateFormValues) {
    mutation.mutate(values);
  }

  return (
    <div className="flex">
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <Button size="icon" variant="ghost">
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={() => {
                  setOpen(true);
                }}
              >
                Save as Template
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              onSelect={() => {
                router.push(`/create/retry/${task.task_id}`);
              }}
            >
              Rerun Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Task as Template</DialogTitle>
            <DialogDescription>
              Save this task definition as a template that can be used later.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form
              id={id}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Task title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        placeholder="Task description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter className="pt-4">
            <Button type="submit" form={id} disabled={mutation.isPending}>
              {mutation.isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
