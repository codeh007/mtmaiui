"use client";
import { type HTMLMotionProps, motion } from "framer-motion";
import { cubicEasingFn } from "mtxuilib/mt/easings";
import { memo } from "react";
const viewTransition = { ease: cubicEasingFn };

interface ViewProps extends HTMLMotionProps<"div"> {
  children: JSX.Element;
}

export const WorkbenchView = memo(({ children, ...props }: ViewProps) => {
  return (
    <motion.div
      className="absolute inset-0"
      transition={viewTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
});
