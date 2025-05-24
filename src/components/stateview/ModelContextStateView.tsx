"use client";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

interface ModelContextStateViewProps {
  modelContextState: {
    messages: {
      content: string;
      source: string;
      type: string;
    }[];
  };
}
export const ModelContextStateView = ({
  modelContextState,
}: ModelContextStateViewProps) => {
  return (
    <div className="bg-gray-100 p-2 rounded-md">
      <div className="text-sm font-bold">ModelContextStateView</div>
      <DebugValue data={{ modelContextState }} />
      <div className="flex flex-col gap-2">
        {modelContextState.messages?.map((x, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={i}>
            <div className="text-sm font-bold">Message {i}</div>
            <div className="text-sm">{x.content}</div>
            <div className="text-sm">{x.source}</div>
            <div className="text-sm">{x.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
