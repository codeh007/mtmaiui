"use client";

import { cn } from "mtxuilib/lib/utils";
import { useMemo } from "react";
import { useMtPathName } from "../../hooks/hooks";
import { useThreadStore } from "../../stores/ChatThread.store";

export const PlaygroundScreen = () => {
  const pathName = useMtPathName();

  const playData = useThreadStore((x) => x.threadUiState.playData);

  const isOpen = useMemo(() => {
    return pathName.includes("/playground");
  }, [pathName]);

  return (
    <div className={cn("p-1 bg-red-300", !isOpen && "hidden")}>
      <pre className="prose dark:prose-invert">
        {JSON.stringify(playData, null, 2)}
      </pre>
    </div>
  );
};
