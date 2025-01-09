"use client";
import { ReactFlowProvider } from "@xyflow/react";

import { Icons } from "mtxuilib/icons/icons";
import { useMemo } from "react";
import { useSidebarStore } from "../../../store/SidebarStore";
import { useWorkflowHasChangesStore } from "../../../store/WorkflowHasChangesStore";
import { useWorkflowQuery } from "../hooks/useWorkflowQuery";
import { FlowRenderer } from "./FlowRenderer";
import { getElements } from "./workflowEditorUtils";

export function WorkflowEditor(props: { workflowPermanentId: string }) {
  const { workflowPermanentId } = props;
  const setCollapsed = useSidebarStore((state) => {
    return state.setCollapsed;
  });
  const setHasChanges = useWorkflowHasChangesStore(
    (state) => state.setHasChanges,
  );

  const { data: workflow, isLoading } = useWorkflowQuery({
    workflowPermanentId,
  });

  useMountedEffect(() => {
    setCollapsed(true);
    setHasChanges(false);
  });

  const initialParameters = useMemo(() => {
    const a = workflow?.workflow_definition.parameters
      .filter(
        (parameter) =>
          parameter.parameter_type === "workflow" ||
          parameter.parameter_type === "bitwarden_login_credential" ||
          parameter.parameter_type === "context",
      )
      .map((parameter) => {
        if (parameter.parameter_type === "workflow") {
          return {
            key: parameter.key,
            parameterType: "workflow",
            dataType: parameter.workflow_parameter_type,
            defaultValue: parameter.default_value,
            description: parameter.description,
          };
        }
        if (parameter.parameter_type === "context") {
          return {
            key: parameter.key,
            parameterType: "context",
            sourceParameterKey: parameter.source.key,
            description: parameter.description,
          };
        }
        return {
          key: parameter.key,
          parameterType: "credential",
          collectionId: parameter.bitwarden_collection_id,
          urlParameterKey: parameter.url_parameter_key,
          description: parameter.description,
        };
      });
    return a;
  }, [workflow]);
  // TODO
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {/* <LogoMinimized /> */}
        <Icons.ReloadIcon2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!workflow) {
    return null;
  }

  const elements = getElements(workflow.workflow_definition.blocks);

  return (
    <div className="relative h-screen w-full p-0 m-0">
      {/* <DebugValue data={{ workflow, initialParameters }} /> */}
      <ReactFlowProvider>
        <FlowRenderer
          workflowPermanentId={workflowPermanentId}
          initialTitle={workflow.title}
          initialNodes={elements.nodes}
          initialEdges={elements.edges}
          initialParameters={initialParameters}
          workflow={workflow}
        />
      </ReactFlowProvider>
    </div>
  );
}
