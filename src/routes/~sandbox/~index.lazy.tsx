import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/sandbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CustomLink to={"/sandbox/example-sandbox"}>Example Sandbox</CustomLink>
    </>
  );
}
