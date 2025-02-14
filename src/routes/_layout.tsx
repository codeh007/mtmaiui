import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="p-2 bg-blue-100 ">
      <div className="border-b">I'm a layout</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
