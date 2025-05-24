import { createLazyFileRoute } from "@tanstack/react-router";
import { generateUUID } from "mtxuilib/lib/utils";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/adk/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  const nav = Route.useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    nav({
      to: `/adk/session/${generateUUID()}`,
    });
  }, []);
  return (
    <>
      <div> createting new session...</div>
    </>
  );
}
