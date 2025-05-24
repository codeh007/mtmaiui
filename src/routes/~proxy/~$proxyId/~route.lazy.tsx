import { Separator } from "@radix-ui/react-dropdown-menu";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";

export const Route = createLazyFileRoute("/proxy/$proxyId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Tabs defaultValue="details">
        <TabsList layout="underlined">
          <CustomLink to="">
            <TabsTrigger variant="underlined" value="details">
              基本
            </TabsTrigger>
          </CustomLink>
          <CustomLink to="actions">
            <TabsTrigger variant="underlined" value="actions">
              操作
            </TabsTrigger>
          </CustomLink>
        </TabsList>
      </Tabs>
      <Separator />
      <Outlet />
    </>
  );
}
