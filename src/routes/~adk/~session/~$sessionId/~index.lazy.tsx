import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import AgentChatView from "../../../../components/chatv2/AgentChatView";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setSessionId = useWorkbenchStore((x) => x.setSessionId);
  useEffect(() => {
    setSessionId(sessionId);
  }, [sessionId, setSessionId]);

  return (
    <>
      <AgentChatView sessionId={sessionId} />
    </>
  );
}
