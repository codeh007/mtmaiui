import { useQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
// import { chatMessagesListOptions } from "mtmaiapi";
import { useEffect } from "react";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/agents/$agent/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setSessionId = useWorkbenchStore((x) => x.setSessionId);
  const tid = useTenantId();
  const chatMessagesQuery = useQuery({
    ...chatMessagesListOptions({
      path: {
        tenant: tid!,
        chat: sessionId,
      },
    }),
  });
  const loadChatMessageList = useWorkbenchStore((x) => x.loadChatMessageList);
  useEffect(() => {
    loadChatMessageList(chatMessagesQuery.data);
  }, [chatMessagesQuery.data, loadChatMessageList]);
  useEffect(() => {
    if (sessionId) {
      setSessionId(sessionId);
    }
  }, [sessionId, setSessionId]);
  return (
    <>
      <Outlet />
    </>
  );
}
