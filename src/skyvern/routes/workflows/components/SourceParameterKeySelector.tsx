"use client";

import { useNodes } from "@xyflow/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "mtxuilib/ui/select";
import { type AppNode, isWorkflowBlockNode } from "../editor/nodes";
import { useWorkflowParametersState } from "../editor/useWorkflowParametersState";
import { getOutputParameterKey } from "../editor/workflowEditorUtils";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function SourceParameterKeySelector({ value, onChange }: Props) {
  const [workflowParameters] = useWorkflowParametersState();
  const nodes = useNodes<AppNode>();
  const contextParameterKeys = workflowParameters
    .filter((parameter) => parameter.parameterType !== "credential")
    .map((parameter) => parameter.key);
  const outputParameterKeys = nodes
    .filter(isWorkflowBlockNode)
    .map((node) => getOutputParameterKey(node.data.label));

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a parameter" />
      </SelectTrigger>
      <SelectContent>
        {[...contextParameterKeys, ...outputParameterKeys].map(
          (parameterKey) => (
            <SelectItem key={parameterKey} value={parameterKey}>
              {parameterKey}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
