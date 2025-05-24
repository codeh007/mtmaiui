import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../../stores/workbrench.store";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/smola/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const workflowRunCreate = useWorkbenchStore(
    (state) => state.workflowRunCreate,
  );
  const handleClick = async () => {
    workflowRunCreate(
      FlowNames.AG,
      {
        content: "你好",
        topic: "default",
        source: "web",
      },
      {
        componentId: "123",
      },
    );
  };
  return (
    <div>
      <Button onClick={handleClick}>运行</Button>
    </div>
  );
}
