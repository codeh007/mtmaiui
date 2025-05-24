"use client";

import { useQuery } from "@tanstack/react-query";
import { adkUserStateGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../hooks/useAuth";

interface AdkUserStateViewProps {
  sessionId: string;
}
export const AdkUserStateView = ({ sessionId }: AdkUserStateViewProps) => {
  const tid = useTenantId();
  const adkStateQuery = useQuery({
    ...adkUserStateGetOptions({
      path: {
        tenant: tid,
        state: sessionId,
      },
    }),
  });

  return (
    <div className="border border-gray-300 rounded-md p-2">
      Adk User State View
      <br />
      session id: {sessionId}
      <DebugValue data={{ data: adkStateQuery.data }} />
    </div>
  );
};
