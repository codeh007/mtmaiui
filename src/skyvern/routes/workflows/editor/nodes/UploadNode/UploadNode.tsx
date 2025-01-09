"use client";

import { UploadIcon } from "@radix-ui/react-icons";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import { HelpTooltip } from "../../../../../components/HelpTooltip";
import { useDeleteNodeCallback } from "../../../hooks/useDeleteNodeCallback";
import { useNodeLabelChangeHandler } from "../../../hooks/useLabelChangeHandler";
import { NodeActionMenu } from "../NodeActionMenu";
import { EditableNodeTitle } from "../components/EditableNodeTitle";
import { type UploadNode, helpTooltipContent } from "./types";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";

export function UploadNode({ id, data }: NodeProps<UploadNode>) {
  const deleteNodeCallback = useDeleteNodeCallback();
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
              <UploadIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <EditableNodeTitle
                value={label}
                editable={data.editable}
                onChange={setLabel}
                titleClassName="text-base"
                inputClassName="text-base"
              />
              <span className="text-xs text-slate-400">Upload Block</span>
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
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-400">File Path</Label>
              <HelpTooltip content={helpTooltipContent["path"]} />
            </div>
            <Input value={data.path} className="nopan text-xs" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
