"use client";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useGraphStore } from "../stores/GraphContextV2";

export const DebugViewCanvas = () => {
  const messages = useGraphStore((state) => state.messages);
  return (
    <div>
      DebugViewCanvas
      <DebugValue data={{ messages }} />
    </div>
  );
};
