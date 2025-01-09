import { motion } from "framer-motion";
import { cn } from "mtxuilib/lib/utils";
import { memo } from "react";

interface AskHumanProps {
  title: string;
  className?: string;
}

export const AskHuman = memo(({ title, className }: AskHumanProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className={cn("bg-red-100 p-2", className)}>askHuman: {title}</div>
    </motion.div>
  );
});
