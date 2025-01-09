"use client";

import type { Message } from "ai";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ReactQueryDevtoolsProduction } from "mtxuilib/components/devtools/DevToolsView";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTenant } from "../hooks/useAuth";
import { useMtmClient } from "../hooks/useMtmapi";
import { useWorkbrenchStore } from "../stores/workbrench.store";
import { Button } from "mtxuilib/ui/button";

interface ChatDevToolsProps {
  messages?: Message[];
  initialOpen?: boolean;
}
export const AssistantDevToolsPanel = ({
  messages,
  initialOpen = false,
}: ChatDevToolsProps) => {
  const [open, setOpen] = useState(initialOpen);
  useHotkeys("ctrl+0", () => {
    setOpen(!open);
  });
  // const workbench = workbenchStore;

  const openChat = useWorkbrenchStore((x) => x.uiState.openChat);
  const setOpenChat = useWorkbrenchStore((x) => x.setOpenChat);
  const threadId = useWorkbrenchStore((x) => x.threadId);
  if (!open) {
    return null;
  }
  return (
    <div className="bg-red-200 p-2">
      <div>threadId:{threadId}</div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            // console.log(workbench);
          }}
        >
          workbench info
        </Button>
        <DevAgentNodeState />

        <ReactQueryDevtoolsProduction
          initialIsOpen={true}
          position="left"
          buttonPosition="bottom-left"
        />

        <Button onClick={() => setOpenChat(!openChat)}>toggle chat</Button>
      </div>
    </div>
  );
};

export const DevAgentNodeState = () => {
  const mtmapi = useMtmClient();
  const tenant = useTenant();
  const threadId = useWorkbrenchStore((x) => x.threadId);
  const nodeStateQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/nodes/{node}",
    {
      params: {
        path: {
          tenant: tenant?.metadata.id,
          node: threadId || "",
        },
      },
    },
    {
      enabled: !!threadId,
    },
  );
  return (
    <>
      <DebugValue data={nodeStateQuery.data} />
      <Button onClick={() => nodeStateQuery.refetch()}>
        refetch agentNodeSate
      </Button>
    </>
  );
};
