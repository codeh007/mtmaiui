"use client";

import { motion } from "framer-motion";
import { cn } from "mtxuilib/lib/utils";

import { type PropsWithChildren, memo } from "react";
import { useWorkbrenchStore } from "../../stores/workbrench.store";

export const WorkbenchWrapper = memo(function WorkbenchWrapper(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  const showWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);
  const setShowWorkbench = useWorkbrenchStore((x) => x.setShowWorkbench);
  return (
    <div
      className={cn("relative w-full h-full overflow-hidden caret-lime-100", {
        "w-0": !showWorkbench,
      })}
    >
      <motion.div
        initial="closed"
        animate={showWorkbench ? "open" : "closed"}
        variants={{
          open: { width: "100%", x: "0%" },
          closed: { width: "0%", x: "100%" },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute inset-0 z-workbench"
      >
        <div className="w-full h-full overflow-auto">{children}</div>
      </motion.div>
    </div>
  );
});

export const WorkbenchHeader = memo(function WorkbenchHeader(
  props: PropsWithChildren,
) {
  const { children } = props;

  return (
    <header
      className={cn(
        "flex items-center bg-bolt-elements-background-depth-1 p-5 border-b h-[var(--header-height)]",
        {
          // "border-transparent": !chat.started,
          "border-transparent": true,
          // "border-bolt-elements-borderColor": chat.started,
        },
      )}
    >
      {children}
    </header>
  );
});

export const WorkbenchContent = memo(function WorkbenchContent(
  props: PropsWithChildren,
) {
  const { children } = props;
  return <div className="w-full">{children}</div>;
});
