"use client";

import type { WorkflowRun } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { TaskDateBadge } from "mtxuilib/mt/relative-date";
import { useWorkflowRunStore } from "../../../stores/workflowRunStore";
import { RunStatus } from "./run-statuses";

export function WorkflowRunList() {
  const listWorkflowRunsData = useWorkflowRunStore(
    (x) => x.listWorkflowRunsData,
  );
  return (
    <div>
      {listWorkflowRunsData?.rows?.map((row) => (
        <WorkflowRunListItem key={row.metadata.id} row={row} />
      ))}
    </div>
  );
}

function WorkflowRunListItem({ row }: { row: WorkflowRun }) {
  const workflow = row.workflowVersion?.workflow;
  return (
    <div className="flex flex-col gap-2 mb-2 bg-amber-50 p-2 rounded-md">
      <div>
        <span>
          <RunStatus status={row.status} />
        </span>
        <CustomLink to={`/workflow-runs/${row.metadata.id}`}>
          {row.displayName}
        </CustomLink>
      </div>

      <div>
        <TaskDateBadge
          date_created_at={row.metadata.createdAt}
          date_updated_at={row.metadata.updatedAt}
          date_finished_at={row.finishedAt}
          date_started_at={row.startedAt}
          duration={row.duration}
        />
        <span className="text-sm text-muted-foreground">
          triggerBy:{row.triggeredBy.eventId}
        </span>
        <span className="text-sm text-muted-foreground">
          workflow:{workflow?.name}
        </span>
      </div>
    </div>
  );
}
