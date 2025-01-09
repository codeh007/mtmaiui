"use client";
// import { agentGetAgentTaskStepArtifactsOptions } from "mtmaiapi/@tanstack/react-query.gen";
import { ZoomableImage } from "../../../components/ZoomableImage";
import { useArtifactImageURL } from "./artifactUtils";

type Props = {
  taskId: string;
  stepId: string;
  index: number;
};

export function ActionScreenshot({ taskId, stepId, index }: Props) {
  // const { data: artifacts, isFetching } = useQuery({
  //   // queryKey: ["task", taskId, "steps", stepId, "artifacts"],
  //   // queryFn: async () => {
  //   //   // const client = await getClient(credentialGetter);
  //   //   return client
  //   //     .get(`/tasks/${taskId}/steps/${stepId}/artifacts`)
  //   //     .then((response) => response.data);
  //   // },
  //   ...agentGetAgentTaskStepArtifactsOptions({
  //     path: {
  //       task_id: taskId,
  //       step_id: stepId,
  //     },
  //   }),
  // });

  // const actionScreenshots = artifacts?.filter(
  //   (artifact) => artifact.artifact_type === ArtifactType.ActionScreenshot,
  // );

  const screenshot = actionScreenshots?.[index];
  const artifactImageURL = useArtifactImageURL(screenshot);

  // if (isFetching) {
  //   return (
  //     <div className="mx-auto flex max-h-[400px] flex-col items-center gap-2 overflow-hidden">
  //       <ReloadIcon className="h-6 w-6 animate-spin" />
  //       <div>Loading screenshot...</div>
  //     </div>
  //   );
  // }

  return screenshot ? (
    <figure className="mx-auto flex max-w-full flex-col items-center gap-2 overflow-hidden">
      <ZoomableImage
        src={artifactImageURL}
        alt={`llm-screenshot,${artifactImageURL}`}
      />
    </figure>
  ) : (
    <div>Screenshot not found</div>
  );
}
