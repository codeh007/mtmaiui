"use client";

import { cn } from "mtxuilib/lib/utils";

import { memo } from "react";

export const WorkbenchWrapper = memo(function WorkbenchWrapper(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  return (
    <div className={cn("flex h-full")}>
      {/* 左侧(聊天面板) */}
      <div className="w-full">{children}</div>
      {/* 右侧面板(主体内容) */}
      {/* <WorkbenchContent /> */}
    </div>
  );
});

// export const WorkbenchContent = () => {
//   const assistantState = useWorkbenchStore((x) => x.assistantState);
//   const subAgents = assistantState?.subAgents;
//   return (
//     <div className="w-full">
//       {subAgents?.[AgentNames.shortVideoAg] && (
//         <ShortVideoAgentView agentId={subAgents[AgentNames.shortVideoAg]} />
//       )}
//     </div>
//   );
// };
