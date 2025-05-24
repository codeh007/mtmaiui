import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, type FlowPlatformAccountFollowInput } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useWorkflowRun } from "../../../../hooks/useWorkflowRun";

export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId/actions/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  return (
    <div className="flex flex-col gap-4 p-2">
      <ActionFollow platformAccountId={platformAccountId} />
    </div>
  );
}

interface ActionFollowProps {
  platformAccountId: string;
}
const ActionFollow = ({ platformAccountId }: ActionFollowProps) => {
  const { workflowRunMutation } = useWorkflowRun(
    FlowNames.PLATFORM_ACCOUNT_LOGIN,
    {},
  );
  return (
    <>
      <Button
        onClick={() => {
          workflowRunMutation.mutate({
            path: {
              workflow: FlowNames.PLATFORM_ACCOUNT_LOGIN,
            },
            body: {
              input: {
                platform_account_id: platformAccountId,
                count_to_follow: 1,
              } satisfies FlowPlatformAccountFollowInput,
            },
          });
        }}
      >
        关注
      </Button>
    </>
  );
};
