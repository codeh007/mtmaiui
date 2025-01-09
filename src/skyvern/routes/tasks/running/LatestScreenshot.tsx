"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { agentGetAgentTaskStepsOptions } from "mtmaiapi/@tanstack/react-query.gen";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import Link from "next/link";
import { useMemo } from "react";
import { useBasePath } from "../../../../hooks/useBasePath";
import { ArtifactType } from "../../../api/types";
import { useArtifactImageURL } from "../detail/artifactUtils";

type Props = {
  id: string;
};

export function LatestScreenshot({ id }: Props) {
  // const {
  // 	data: artifact,
  // 	isFetching,
  // 	isError,
  // } = useQuery<ArtifactApiResponse | undefined>({
  // 	queryKey: ["task", id, "latestScreenshot"],
  // 	queryFn: async () => {
  // 		const client = await getClient(credentialGetter);
  // 		const steps: StepApiResponse[] = await client
  // 			.get(`/tasks/${id}/steps`)
  // 			.then((response) => response.data);

  // 		if (steps.length === 0) {
  // 			return;
  // 		}

  // 		const latestStep = steps[steps.length - 1];

  // 		if (!latestStep) {
  // 			return;
  // 		}

  // 		const artifacts: ArtifactApiResponse[] = await client
  // 			.get(`/tasks/${id}/steps/${latestStep.step_id}/artifacts`)
  // 			.then((response) => response.data);

  // 		const actionScreenshots = artifacts?.filter(
  // 			(artifact) => artifact.artifact_type === ArtifactType.ActionScreenshot,
  // 		);

  // 		if (actionScreenshots.length > 0) {
  // 			return actionScreenshots[0];
  // 		}

  // 		const llmScreenshots = artifacts?.filter(
  // 			(artifact) => artifact.artifact_type === ArtifactType.LLMScreenshot,
  // 		);

  // 		if (llmScreenshots.length > 0) {
  // 			return llmScreenshots[0];
  // 		}

  // 		return Promise.reject("No screenshots found");
  // 	},
  // 	refetchInterval: 10000,
  // 	placeholderData: keepPreviousData,
  // });

  const query = useSuspenseQuery({
    ...agentGetAgentTaskStepsOptions({
      path: {
        task_id: id,
      },
    }),
  });
  const data = query.data;

  const latestStep = useMemo(() => {
    return data?.[data.length - 1];
  }, [data]);

  const artifact = useMemo(() => {
    return latestStep?.artifacts?.find(
      (artifact) => artifact.artifact_type === ArtifactType.ActionScreenshot,
    );
  }, [latestStep]);

  // if (isFetching && !artifact) {
  // 	return <Skeleton className="h-full w-full" />;
  // }

  // if (isError || !artifact) {
  // 	return null;
  // }
  // if (!artifact) {
  // 	return null;
  // }

  const basePath = useBasePath();
  const imgUrl = useArtifactImageURL(artifact);

  return (
    <>
      <DebugValue data={{ data }} />
      {!artifact ? (
        <>暂无图片</>
      ) : (
        <Link href={`${basePath}/tasks/${id}/actions`}>
          <img
            src={imgUrl}
            className="h-full w-full object-contain"
            alt="Latest screenshot"
          />
        </Link>
      )}
    </>
  );
}
