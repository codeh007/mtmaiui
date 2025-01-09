"use client";
import { CursorTextIcon } from "@radix-ui/react-icons";
import { Handle, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { useState } from "react";
import { HelpTooltip } from "../../../../../components/HelpTooltip";
import { useDeleteNodeCallback } from "../../../hooks/useDeleteNodeCallback";
import { useNodeLabelChangeHandler } from "../../../hooks/useLabelChangeHandler";
import { NodeActionMenu } from "../NodeActionMenu";
import { EditableNodeTitle } from "../components/EditableNodeTitle";
import { type FileParserNode, helpTooltipContent } from "./types";

export function FileParserNode({ id, data }: NodeProps<FileParserNode>) {
  const { updateNodeData } = useReactFlow();
  const deleteNodeCallback = useDeleteNodeCallback();
  const [inputs, setInputs] = useState({
    fileUrl: data.fileUrl,
  });
  const [label, setLabel] = useNodeLabelChangeHandler({
    id,
    initialValue: data.label,
  });

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <div className="w-[30rem] space-y-4 rounded-lg bg-slate-elevation3 px-6 py-4">
        <div className="flex h-[2.75rem] justify-between">
          <div className="flex gap-2">
            <div className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded border border-slate-600">
              <CursorTextIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <EditableNodeTitle
                value={label}
                editable={data.editable}
                onChange={setLabel}
                titleClassName="text-base"
                inputClassName="text-base"
              />
              <span className="text-xs text-slate-400">File Parser Block</span>
            </div>
          </div>
          <NodeActionMenu
            onDelete={() => {
              deleteNodeCallback(id);
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">File URL</Label>
              <HelpTooltip content={helpTooltipContent["fileUrl"]} />
            </div>
            <Input
              value={inputs.fileUrl}
              onChange={(event) => {
                if (!data.editable) {
                  return;
                }
                setInputs({ ...inputs, fileUrl: event.target.value });
                updateNodeData(id, { fileUrl: event.target.value });
              }}
              className="nopan text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
