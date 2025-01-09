"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, PlayIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchToCurl from "fetch-to-curl";

import Link from "next/link";
import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { stringify as convertToYAML } from "yaml";
import { useBasePath } from "../../../../hooks/useBasePath";

import { AutoResizingTextarea } from "mtxuilib/components/AutoResizingTextarea";
import { copyText } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Separator } from "mtxuilib/ui/separator";
import { ToastAction } from "mtxuilib/ui/toast";
import { useToast } from "mtxuilib/ui/use-toast";
import { CodeEditor } from "../../workflows/components/CodeEditor";
import { MAX_STEPS_DEFAULT } from "../constants";
import { TaskFormSection } from "./TaskFormSection";
import { type SavedTaskFormValues, savedTaskFormSchema } from "./taskFormTypes";

function transform(value: unknown) {
  return value === "" ? null : value;
}

function createTaskRequestObject(formValues: SavedTaskFormValues) {
  let extractedInformationSchema = "";
  if (formValues.extractedInformationSchema) {
    try {
      extractedInformationSchema = JSON.parse(
        formValues.extractedInformationSchema,
      );
    } catch (e) {
      extractedInformationSchema = formValues.extractedInformationSchema;
    }
  }

  let errorCodeMapping = "";
  if (formValues.errorCodeMapping) {
    try {
      errorCodeMapping = JSON.parse(formValues.errorCodeMapping);
    } catch (e) {
      errorCodeMapping = formValues.errorCodeMapping;
    }
  }

  return {
    url: formValues.url,
    webhook_callback_url: transform(formValues.webhookCallbackUrl),
    navigation_goal: transform(formValues.navigationGoal),
    data_extraction_goal: transform(formValues.dataExtractionGoal),
    proxy_location: transform(formValues.proxyLocation),
    navigation_payload: transform(formValues.navigationPayload),
    extracted_information_schema: extractedInformationSchema,
    totp_verification_url: transform(formValues.totpVerificationUrl),
    totp_identifier: transform(formValues.totpIdentifier),
    error_code_mapping: errorCodeMapping,
  };
}

function createTaskTemplateRequestObject(values: SavedTaskFormValues) {
  let extractedInformationSchema = "";
  if (values.extractedInformationSchema) {
    try {
      extractedInformationSchema = JSON.parse(
        values.extractedInformationSchema,
      );
    } catch (e) {
      extractedInformationSchema = values.extractedInformationSchema;
    }
  }

  let errorCodeMapping = "";
  if (values.errorCodeMapping) {
    try {
      errorCodeMapping = JSON.parse(values.errorCodeMapping);
    } catch (e) {
      errorCodeMapping = values.errorCodeMapping;
    }
  }

  return {
    title: values.title,
    description: values.description,
    is_saved_task: true,
    webhook_callback_url: values.webhookCallbackUrl,
    proxy_location: values.proxyLocation,
    workflow_definition: {
      parameters: [
        {
          parameter_type: "workflow",
          workflow_parameter_type: "json",
          key: "navigation_payload",
          default_value: JSON.stringify(values.navigationPayload),
        },
      ],
      blocks: [
        {
          block_type: "task",
          label: "Task 1",
          url: values.url,
          navigation_goal: values.navigationGoal,
          data_extraction_goal: values.dataExtractionGoal,
          data_schema: extractedInformationSchema,
          max_steps_per_run: values.maxStepsOverride,
          totp_verification_url: values.totpVerificationUrl,
          totp_identifier: values.totpIdentifier,
          error_code_mapping: errorCodeMapping,
        },
      ],
    },
  };
}

type Section = "base" | "extraction" | "advanced";
type Props = {
  initialValues: SavedTaskFormValues;
  template: string;
};
export function SavedTaskForm({ initialValues, template }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeSections, setActiveSections] = useState<Array<Section>>([
    "base",
  ]);
  const [showAdvancedBaseContent, setShowAdvancedBaseContent] = useState(false);

  const { data: organizations } = useQuery({
    ...getOrganizationsOptions(),
  });

  const organization = organizations?.[0];

  const form = useForm<SavedTaskFormValues>({
    resolver: zodResolver(savedTaskFormSchema),
    defaultValues: initialValues,
    values: {
      ...initialValues,
      maxStepsOverride: initialValues.maxStepsOverride ?? null,
    },
  });
  const basePath = useBasePath();

  const { isDirty, errors } = useFormState({ control: form.control });

  const createAndSaveTaskMutation = useMutation({
    // mutationFn: async (formValues: SavedTaskFormValues) => {
    //   // const saveTaskRequest = createTaskTemplateRequestObject(formValues);
    //   // const yaml = convertToYAML(saveTaskRequest);

    //   // return client
    //   //   .put(`/workflows/${template}`, yaml, {
    //   //     headers: {
    //   //       "Content-Type": "text/plain",
    //   //     },
    //   //   })
    //   //   .then(() => {
    //   //     const taskRequest = createTaskRequestObject(formValues);
    //   //     const includeOverrideHeader =
    //   //       formValues.maxStepsOverride !== null &&
    //   //       formValues.maxStepsOverride !== MAX_STEPS_DEFAULT;
    //   //     return client.post<
    //   //       ReturnType<typeof createTaskRequestObject>,
    //   //       { data: { task_id: string } }
    //   //     >("/tasks", taskRequest, {
    //   //       ...(includeOverrideHeader && {
    //   //         headers: {
    //   //           "x-max-steps-override":
    //   //             formValues.maxStepsOverride ?? MAX_STEPS_DEFAULT,
    //   //         },
    //   //       }),
    //   //     });
    //   //   });

    // },
    ...updateWorkflowMutation(),
    onError: (error) => {
      if (error.response?.status === 402) {
        toast({
          variant: "destructive",
          title: "Failed to create task",
          description:
            "You don't have enough credits to run this task. Go to billing to see your credit balance.",
          action: (
            <ToastAction altText="Go to Billing">
              <Button asChild>
                <Link href="billing">Go to Billing</Link>
              </Button>
            </ToastAction>
          ),
        });
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    },
    onSuccess: (response) => {
      // toast({
      //   title: "Task Created",
      //   description: `${response.data?.task_id} created successfully.`,
      //   action: (
      //     <ToastAction altText="View">
      //       <Button asChild>
      //         <Link href={`${basePath}/tasks/${response.data?.task_id}`}>
      //           View
      //         </Link>
      //       </Button>
      //     </ToastAction>
      //   ),
      // });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["savedTasks"],
      });
    },
  });

  const saveTaskMutation = useMutation({
    ...updateWorkflowMutation(),
  });

  const createTaskMutation = useMutation({
    ...agentCreateAgentTaskMutation(),
  });

  // 保存模板 同时创建 task
  async function handleCreate(values: SavedTaskFormValues) {
    const saveTaskRequest = createTaskTemplateRequestObject(values);
    const yaml = convertToYAML(saveTaskRequest);
    const a = await createAndSaveTaskMutation.mutateAsync({
      body: {
        yaml: yaml,
      },
      path: {
        workflow_permanent_id: template,
      },
    });
    const taskRequest = createTaskRequestObject(values);
    const response = await createTaskMutation.mutateAsync({
      body: { ...taskRequest },
      path: {
        workflow_permanent_id: template,
      },
    });
    toast({
      title: "Task Created",
      description: `${response?.task_id} created successfully.`,
      action: (
        <ToastAction altText="View">
          <Button asChild>
            <Link href={`${basePath}/tasks/${response?.task_id}`}>View</Link>
          </Button>
        </ToastAction>
      ),
    });
  }

  async function handleSave(values: SavedTaskFormValues) {
    try {
      const saveTaskRequest = createTaskTemplateRequestObject(values);
      const yaml = convertToYAML(saveTaskRequest);
      await saveTaskMutation.mutateAsync({
        body: {
          yaml: yaml,
        },
        path: {
          workflow_permanent_id: template,
        },
      });
      toast({
        title: "Changes saved",
        description: "Changes saved successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["savedTasks", template],
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "There was an error while saving changes",
        description: (e as Error).message,
      });
    }
  }

  function isActive(section: Section) {
    return activeSections.includes(section);
  }

  function toggleSection(section: Section) {
    if (isActive(section)) {
      setActiveSections(activeSections.filter((s) => s !== section));
    } else {
      setActiveSections([...activeSections, section]);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          const submitter = (
            (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
          ).value;
          if (submitter === "create") {
            form.handleSubmit(handleCreate)(event);
          }
          if (submitter === "save") {
            form.handleSubmit(handleSave)(event);
          }
        }}
        className="space-y-4"
      >
        <TaskFormSection
          index={1}
          title="Base Content"
          active={isActive("base")}
          onClick={() => {
            toggleSection("base");
          }}
          hasError={
            typeof errors?.navigationGoal !== "undefined" ||
            typeof errors?.title !== "undefined" ||
            typeof errors?.url !== "undefined" ||
            typeof errors?.description !== "undefined"
          }
        >
          {isActive("base") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Title</h1>
                            <h2 className="text-base text-slate-400">
                              Name of your task
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input placeholder="Task Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Description</h1>
                            <h2 className="text-base text-slate-400">
                              What is the purpose of the task?
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <AutoResizingTextarea
                              placeholder="This template is used to..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">URL</h1>
                            <h2 className="text-base text-slate-400">
                              The starting URL for the task
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="navigationGoal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Navigation Goal</h1>
                            <h2 className="text-base text-slate-400">
                              Where should Skyvern go and what should Skyvern
                              do?
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <AutoResizingTextarea
                              {...field}
                              placeholder="Tell Skyvern what to do."
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                {showAdvancedBaseContent ? (
                  <div className="border-t border-dashed pt-4">
                    <FormField
                      control={form.control}
                      name="navigationPayload"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex gap-16">
                            <FormLabel>
                              <div className="w-72">
                                <h1 className="text-lg">Navigation Payload</h1>
                                <h2 className="text-base text-slate-400">
                                  Specify important parameters, routes, or
                                  states
                                </h2>
                              </div>
                              <Button
                                className="mt-4"
                                type="button"
                                variant="tertiary"
                                onClick={() => {
                                  setShowAdvancedBaseContent(false);
                                }}
                                size="sm"
                              >
                                Hide Advanced Settings
                              </Button>
                            </FormLabel>
                            <div className="w-full">
                              <FormControl>
                                <CodeEditor
                                  {...field}
                                  language="json"
                                  minHeight="96px"
                                  maxHeight="500px"
                                  value={
                                    field.value === null ? "" : field.value
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={() => {
                        setShowAdvancedBaseContent(true);
                      }}
                      size="sm"
                    >
                      Show Advanced Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TaskFormSection>
        <TaskFormSection
          index={2}
          title="Extraction"
          active={isActive("extraction")}
          onClick={() => {
            toggleSection("extraction");
          }}
          hasError={
            typeof errors?.extractedInformationSchema !== "undefined" ||
            typeof errors?.dataExtractionGoal !== "undefined"
          }
        >
          {isActive("extraction") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dataExtractionGoal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Data Extraction Goal</h1>
                            <h2 className="text-base text-slate-400">
                              What outputs are you looking to get?
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <AutoResizingTextarea
                              {...field}
                              placeholder="What data do you need to extract?"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="extractedInformationSchema"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Data Schema</h1>
                            <h2 className="text-base text-slate-400">
                              Specify the output format in JSON
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <CodeEditor
                              {...field}
                              language="json"
                              minHeight="96px"
                              maxHeight="500px"
                              value={
                                field.value === null ||
                                typeof field.value === "undefined"
                                  ? ""
                                  : field.value
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </TaskFormSection>
        <TaskFormSection
          index={3}
          title="Advanced Settings"
          active={isActive("advanced")}
          onClick={() => {
            toggleSection("advanced");
          }}
          hasError={
            typeof errors?.navigationPayload !== "undefined" ||
            typeof errors?.maxStepsOverride !== "undefined" ||
            typeof errors?.webhookCallbackUrl !== "undefined" ||
            typeof errors?.errorCodeMapping !== "undefined"
          }
        >
          {isActive("advanced") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="maxStepsOverride"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Max Steps Override</h1>
                            <h2 className="text-base text-slate-400">
                              Want to allow this task to execute more or less
                              steps than the default?
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={1}
                              value={field.value ?? ""}
                              placeholder={`Default: ${organization?.max_steps_per_run ?? MAX_STEPS_DEFAULT}`}
                              onChange={(event) => {
                                const value =
                                  event.target.value === ""
                                    ? null
                                    : Number(event.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="webhookCallbackUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Webhook Callback URL</h1>
                            <h2 className="text-base text-slate-400">
                              The URL of a webhook endpoint to send the
                              extracted information
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="errorCodeMapping"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Error Messages</h1>
                            <h2 className="text-base text-slate-400">
                              Specify any error outputs you would like to be
                              notified about
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <CodeEditor
                              {...field}
                              language="json"
                              minHeight="96px"
                              maxHeight="500px"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="totpVerificationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">2FA Verification URL</h1>
                            {/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
                            <h2 className="text-base text-slate-400" />
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Provide your 2FA endpoint"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totpIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">2FA Identifier</h1>
                            {/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
                            {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                            <h2 className="text-base text-slate-400"></h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Add an ID that links your TOTP to the task"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </TaskFormSection>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              const curl = fetchToCurl({
                method: "POST",
                url: `${apiBaseUrl}/tasks`,
                body: createTaskRequestObject(form.getValues()),
                headers: {
                  "Content-Type": "application/json",
                  // "x-api-key": apiCredential ?? "<your-api-key>",
                },
              });
              copyText(curl).then(() => {
                toast({
                  title: "Copied cURL",
                  description: "cURL copied to clipboard",
                });
              });
            }}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            cURL
          </Button>
          <Button
            type="submit"
            name="save"
            value="save"
            variant="secondary"
            disabled={saveTaskMutation.isPending || !isDirty}
          >
            {saveTaskMutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
          <Button
            type="submit"
            name="create"
            value="create"
            disabled={
              createAndSaveTaskMutation.isPending ||
              createTaskMutation.isPending
            }
          >
            {createAndSaveTaskMutation.isPending ||
            createTaskMutation.isPending ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayIcon className="mr-2 h-4 w-4" />
            )}
            保存并运行
          </Button>
        </div>
      </form>
    </Form>
  );
}
