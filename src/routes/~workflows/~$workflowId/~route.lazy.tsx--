"use client";

import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { WorkflowDetailProvider } from "./workflowId.store";
export const Route = createLazyFileRoute("/workflows/$workflowId")({
  component: ExpandedWorkflow,
});

export default function ExpandedWorkflow() {
  return (
    <WorkflowDetailProvider>
      <Outlet />
    </WorkflowDetailProvider>
  );
}
