import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { CustomLink } from "../../components/CreatedLink";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg border-b">
        <CustomLink
          data-disable-nprogress={true}
          data-prevent-nprogress={true}
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home222
        </CustomLink>{" "}
        <CustomLink
          data-disable-nprogress={true}
          data-prevent-nprogress={true}
          to="/posts"
          activeProps={{
            className: "font-bold",
          }}
        >
          Posts
        </CustomLink>{" "}
        {/* <Link
          to="/layout-a"
          activeProps={{
            className: "font-bold",
          }}
        >
          Layout
        </Link>{" "} */}
        <CustomLink
          to="/anchor"
          activeProps={{
            className: "font-bold",
          }}
        >
          Anchor
        </CustomLink>{" "}
        <CustomLink
          to="/this-route-does-not-exist"
          activeProps={{
            className: "font-bold",
          }}
        >
          This Route Does Not Exist
        </CustomLink>
      </div>
      <hr />
      <Outlet />
      {/* Start rendering router matches */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
