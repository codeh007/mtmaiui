import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
// import { browserOpenMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/browser/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TestOpenBrowser />
    </div>
  );
}

const TestOpenBrowser = () => {
  const browserOpenMu = useMutation({
    ...browserOpenMutation({}),
  });

  const tid = useTenantId();

  return (
    <>
      <Button
        onClick={() => {
          browserOpenMu.mutate({
            path: {
              tenant: tid,
              browser: "browserid123",
            },
            body: {
              urls: ["https://whoer.net", "https://pixelscan.net"],
            },
          });
        }}
      >
        打开浏览器1
      </Button>
    </>
  );
};
