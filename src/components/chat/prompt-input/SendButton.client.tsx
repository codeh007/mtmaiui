"use client";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import { Square } from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className={cn(
            "absolute flex justify-center items-center top-[18px] right-[22px] p-1 bg-alpha-gray-10 hover:brightness-94 color-white rounded-md w-[34px] h-[34px] transition-theme",
          )}
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        >
          <div className="text-lg">
            {!isStreaming ? (
              <Icons.PaperPlane className="size-5" />
            ) : (
              <Square className="size-5" />
            )}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
