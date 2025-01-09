import { useTaskQuery } from "../../detail/hooks/useTaskQuery";
import { CreateNewTaskForm } from "../CreateNewTaskForm";

interface RetryTaskProps {
  taskId: string;
}

export function RetryTask({ taskId }: RetryTaskProps) {
  const { data: task, isLoading } = useTaskQuery({ id: taskId });

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!task) {
    return null;
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl">任务重试</h1>
      </header>
      <CreateNewTaskForm
        initialValues={{
          url: task.request.url,
          navigationGoal: task.request.navigation_goal ?? "",
          navigationPayload:
            typeof task.request.navigation_payload === "string"
              ? task.request.navigation_payload
              : JSON.stringify(task.request.navigation_payload, null, 2),
          dataExtractionGoal: task.request.data_extraction_goal ?? "",
          extractedInformationSchema:
            typeof task.request.extracted_information_schema === "string"
              ? task.request.extracted_information_schema
              : JSON.stringify(
                  task.request.extracted_information_schema,
                  null,
                  2,
                ),
          webhookCallbackUrl: task.request.webhook_callback_url ?? "",
          totpIdentifier: task.request.totp_identifier ?? "",
          totpVerificationUrl: task.request.totp_verification_url ?? "",
          errorCodeMapping: task.request.error_code_mapping
            ? JSON.stringify(task.request.error_code_mapping, null, 2)
            : "",
        }}
      />
    </div>
  );
}
