"use client";

// import { getWorkflowOptions } from "mtmaiapi/@tanstack/react-query.gen";

type Props = {
  workflowPermanentId: string;
};

export function useWorkflowQuery({ workflowPermanentId }: Props) {
  // return useQuery<WorkflowApiResponse>({
  //   queryKey: ["workflow", workflowPermanentId],
  //   queryFn: async () => {
  //     const client = await getClient(credentialGetter);
  //     return client
  //       .get(`/workflows/${workflowPermanentId}`)
  //       .then((response) => response.data);
  //   },
  // });

  // const query = useQuery({
  // 	...getWorkflowOptions({
  // 		path: {
  // 			workflow_permanent_id: workflowPermanentId,
  // 		},
  // 	}),
  // });
  // return query;
  return null;
}
