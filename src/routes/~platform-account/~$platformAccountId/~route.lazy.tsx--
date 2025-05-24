"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Separator } from "mtxuilib/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { PlatformAccountDetailHeader } from "./headers";
export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { platformAccountId } = Route.useParams();
  return (
    <>
      <PlatformAccountDetailHeader id={platformAccountId} />

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
