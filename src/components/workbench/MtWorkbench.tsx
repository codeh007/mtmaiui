"use client";

import { type Variants, motion } from "framer-motion";
import { cubicEasingFn } from "mtxuilib/mt/easings";
import { Suspense, memo } from "react";

import { SkeletonLoading } from "mtxuilib/components/skeletons/SkeletonLoading";
import { cn } from "mtxuilib/lib/utils";
import { useWorkbrenchStore } from "../../stores/workbrench.store";
import { getViewByName } from "../LzComponents";

export interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

export const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: "var(--workbench-width)",
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const MtWorkbench = memo(
  ({ chatStarted, isStreaming }: WorkspaceProps) => {
    // renderLogger.trace("Workbench");
    const showWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);
    const currentWorkbench = useWorkbrenchStore(
      (x) => x.uiState.currentWorkbenchView,
    );

    const currentView = getViewByName(currentWorkbench || "");
    const WorkbenchView = getViewByName(currentWorkbench || "");
    const workbenchViewProps = useWorkbrenchStore((x) => x.workbenchViewProps);
    return (
      <>
        <motion.div
          initial="closed"
          animate={showWorkbench ? "open" : "closed"}
          variants={workbenchVariants}
          className={cn("z-workbench", {
            "bg-red-100": true,
            "w-0": !showWorkbench,
          })}
        >
          {/* <DebugValue data={{ workbenchViewProps }} /> */}
          <Suspense fallback={<SkeletonLoading />}>
            {currentView?.length > 0 && (
              <WorkbenchView
                isStreaming={isStreaming}
                {...workbenchViewProps}
              />
            )}
          </Suspense>
        </motion.div>
      </>
    );
  },
);
