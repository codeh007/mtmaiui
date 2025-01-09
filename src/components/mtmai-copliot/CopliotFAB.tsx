"use client";

import { motion } from "framer-motion";
import { CopliotIcon } from "mtxuilib/icons/CopliotIcon";
import { IconX, Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { buttonVariants } from "mtxuilib/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "mtxuilib/ui/tooltip";
import { useState } from "react";
import { useMtmaiV2 } from "../../stores/StoreProvider";

export const CopliotFAB = () => {
  const threadUiState = useThreadStore((x) => x.threadUiState);
  const isOpen = useThreadStore((x) => x.threadUiState.isOpen);
  const setThreadUiState = useThreadStore((x) => x.setThreadUiState);
  const handleClick = () => {
    setThreadUiState({
      ...threadUiState,
      isOpen: !threadUiState.isOpen,
    });
  };
  return (
    <>
      <div className="fixed bottom-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleClick()}
          className={cn(
            buttonVariants(),
            "fixed right-4 flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-0 px-0 rounded-full shadow-lg transition-all duration-300 ease-in-out",
            isOpen ? "bottom-14" : "bottom-4 p-4 ",
            isOpen ? "right-1 w-8 h-8 p-0 m-0" : "right-4",
            isOpen && "hidden",
          )}
        >
          {!isOpen ? (
            <>
              <CopliotIcon />
              <span>{threadUiState?.fabDisplayText || "Ask AI"}</span>
            </>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icons.X className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close Chat</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </motion.button>
        {isOpen && <AsiderTabs />}
      </div>
    </>
  );
};

const AsiderTabs = () => {
  const siderNavMenus = useMtmaiV2((x) => x.asiderMenus);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col items-end  shadow-lg rounded-l-md">
      {siderNavMenus?.map((item) => (
        <DashNavItemView key={item.url} item={item} />
      ))}
    </div>
  );
};

export function DashNavItemView({ item }: { item: DashNavItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const threadUiState = useThreadStore((x) => x.threadUiState);
  const setThreadUiState = useThreadStore((x) => x.setThreadUiState);
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleClick = () => {
    if (item.url) {
      setThreadUiState({
        ...threadUiState,
        activateViewName: item.url,
      });
    }
  };

  return (
    <div
      className="relative flex items-center justify-end"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn(
          "absolute right-full mr-2 whitespace-nowrap bg-background px-3 py-2 rounded-md shadow-md",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "auto", opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {item.title}
      </motion.div>
      <motion.button
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-l-md hover:bg-primary/20 transition-colors",
          isExpanded && "bg-primary/20",
        )}
      >
        <IconX name={item.icon} className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
