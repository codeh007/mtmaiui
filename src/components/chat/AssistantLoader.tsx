"use client";

import type { PropsWithChildren } from "react";
import { useTenant } from "../../hooks/useAuth";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import { AssistantDevToolsPanel } from "../AssistantDevTools";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
interface ConfigLoaderProps {
  chatProfile?: string;
  autoStart?: boolean;
  threadId?: string;
  selectedModelId?: string;
}
export const AssistantLoader = ({
  chatProfile,
  children,
  threadId,
}: PropsWithChildren<ConfigLoaderProps>) => {
  const tenant = useTenant();
  const backendUrl = useMtmaiV2((x) => x.backends[0]);
  const accessToken = useMtmaiV2((x) => x.accessToken);

  return (
    <MtSuspenseBoundary>
      <WorkbrenchProvider
        backendUrl={backendUrl}
        accessToken={accessToken}
        chatProfile={chatProfile}
        // autoConnectWs={false}
        threadId={threadId}
        tenant={tenant}
      >
        <MtSuspenseBoundary>{children}</MtSuspenseBoundary>
        <AssistantDevToolsPanel />
      </WorkbrenchProvider>
    </MtSuspenseBoundary>
  );
};
