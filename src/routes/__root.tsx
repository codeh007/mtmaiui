import { Outlet, createRootRoute } from "@tanstack/react-router";
import { CustomLink } from "../components/CreatedLink";
import { LzAssisantFAB } from "../components/assisant/AssisantFABLz";
import { NotFound } from "../components/notFound";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <LzAssisantFAB />
      <div className="p-2 flex gap-2 text-lg border-b">
        <CustomLink
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </CustomLink>{" "}
        <CustomLink
          to="/posts"
          activeProps={{
            className: "font-bold",
          }}
        >
          Posts
        </CustomLink>
        <CustomLink
          to="/dash"
          activeProps={{
            className: "font-bold",
          }}
        >
          Dash
        </CustomLink>{" "}
        <CustomLink
          // @ts-expect-error
          to="/this-route-does-not-exist"
          activeProps={{
            className: "font-bold",
          }}
        >
          Route Does Not Exist
        </CustomLink>
      </div>
      <hr />
      <Outlet />
      {/* Start rendering router matches */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
