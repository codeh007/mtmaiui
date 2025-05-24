import { createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";

export const Route = createLazyFileRoute("/resource/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full w-full p-2">
      <CustomLink to={"/resource/new/platform_account"}>新建ig账号</CustomLink>
    </div>
  );
}
