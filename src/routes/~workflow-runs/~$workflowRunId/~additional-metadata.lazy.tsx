import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";
import { RunSummary } from "../components/RunSummary";

export const Route = createLazyFileRoute(
  "/workflow-runs/$workflowRunId/additional-metadata",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <RunSummary data={shape.data} />
      </div>

      <CustomLink
        to={`/workflows/${shape.data?.workflowId}`}
        className={cn(buttonVariants({ variant: "outline" }))}
        target="_blank"
        rel="noreferrer"
      >
        <Button size={"sm"} className="px-2 py-2 gap-2">
          <ArrowTopRightIcon className="size-4" />
          工作流定义
        </Button>
      </CustomLink>
      <CodeHighlighter
        className="my-1"
        language="json"
        code={JSON.stringify(shape.data?.additionalMetadata, null, 2)}
      />
    </>
  );
}
