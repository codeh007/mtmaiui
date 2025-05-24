import type { WorkflowRun } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";

interface WorkflowRunsSideBarItemProps {
  workflowRun: WorkflowRun;
}
export const WorkflowRunsSideBarItem = ({
  workflowRun,
}: WorkflowRunsSideBarItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-base font-medium text-foreground bg-amber-100 p-2">
        <div>
          <CustomLink to={`${workflowRun.metadata.id}`} className="text-sm">
            <span className="font-semibold">ID:</span> {workflowRun.metadata.id}
          </CustomLink>
        </div>
        <div>
          <span className="font-semibold">Status:</span> {workflowRun.status}
        </div>
      </div>
    </div>
  );
};
