import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames } from "mtmaiapi";
import FlowForm from "../../../../../components/flow-form/FlowForm";
import { FlowTenantFields } from "../../../../../components/flow-form/flow-forms/FlowTenantFields";

export const Route = createLazyFileRoute("/workflows/$workflowId/trigger/tenant/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const toast = useToast();
  // const handleNavToWorkflowRun = (id: string) => {
  //   nav({
  //     to: `/workflow-runs/${id}`,
  //   });
  // };
  // const workflowRunCreate = useMutation({
  //   ...workflowRunCreateMutation(),
  //   onSuccess: (resp) => {
  //     toast.toast({
  //       title: "Workflow run created",
  //       description: (
  //         <div>
  //           <Button onClick={() => handleNavToWorkflowRun(resp?.metadata?.id)}>
  //             View Workflow
  //           </Button>
  //         </div>
  //       ),
  //     });
  //   },
  // });
  // const handleClick = async () => {
  //   workflowRunCreate.mutate({
  //     path: {
  //       workflow: FlowNames.TENANT,
  //     },
  //     body: {
  //       input: {},
  //     },
  //   });
  // };
  return (
    <FlowForm workflowName={FlowNames.TENANT}>
      <FlowTenantFields />
    </FlowForm>
  );
}
