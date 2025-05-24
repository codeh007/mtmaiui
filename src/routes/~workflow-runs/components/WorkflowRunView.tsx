"use Client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  // type ChatMessage,
  WorkflowRunStatus,
  // agStateGetOptions,
  // chatMessagesListOptions,
  workflowRunGetOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useMemo } from "react";
import { useTenantId } from "../../../hooks/useAuth";
// import { AgStateView } from "../../~ag_state/components/AgStateView";

interface WorkflowRunViewProps {
  runId: string;
}

export const WorkflowRunView = ({ runId }: WorkflowRunViewProps) => {
  const tid = useTenantId();
  // const sessionId = useWorkbenchStore((x) => x.threadId);
  const workflowRun = useSuspenseQuery({
    ...workflowRunGetOptions({
      path: {
        tenant: tid,
        "workflow-run": runId,
      },
    }),
  });

  const agStateQuery = useQuery({
    ...agStateGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        run: runId,
        // state: "workflow-run",
      },
    }),
    enabled: !!workflowRun.data,
  });

  // useEffect(() => {
  //   if (agStateQuery.data?.metadata?.id) {
  //     const workflowRunId = agStateQuery.data.metadata?.id;
  //     console.log("开始拉取stream, workflowRunId:", workflowRunId);
  //   }
  // }, [agStateQuery.data]);

  const statusText = useMemo(() => {
    return workflowRun.data?.status;
  }, [workflowRun.data?.status]);

  return (
    <>
      <div className="bg-slate-100 p-2">{/* {sessionId} / {runId} */}</div>
      <div>
        <DebugValue data={{ workflowRun }} />
        {statusText === WorkflowRunStatus.RUNNING && <div>运行中</div>}
        {statusText === WorkflowRunStatus.SUCCEEDED && agStateQuery.data && (
          <div>
            {/* <AgStateView agState={agStateQuery.data} /> */}
            TODO: AgStateView
          </div>
        )}
      </div>
      {/* {sessionId && <AgChatView sessionId={sessionId} />} */}
    </>
  );
};

interface AgChatViewProps {
  sessionId: string;
}
const AgChatView = ({ sessionId }: AgChatViewProps) => {
  const tid = useTenantId();
  const messagesQuery = useQuery({
    ...chatMessagesListOptions({
      path: {
        tenant: tid,
        chat: sessionId,
      },
    }),
  });
  return (
    <div>
      {sessionId}
      <DebugValue data={{ messagesQuery }} />
      {messagesQuery.data?.rows?.map((message) => (
        <AgChatMessageView key={message.metadata.id} message={message} />
      ))}
    </div>
  );
};

const AgChatMessageView = ({ message }: { message: ChatMessage }) => {
  return <div className="bg-slate-100 p-2">{message.content}</div>;
};
