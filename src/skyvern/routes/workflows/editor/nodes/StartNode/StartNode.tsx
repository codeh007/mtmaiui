import { Handle, Position } from "@xyflow/react";
import type { Node } from "@xyflow/react";

export function StartNode() {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <div className="w-[30rem] rounded-lg bg-slate-elevation3 px-6 py-4 text-center border border-slate-400">
        Start
      </div>
    </div>
  );
}

export type StartNodeData = Record<string, never>;

export type StartNode = Node<StartNodeData, "start">;
