import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
  component: RoutePostListComponent,
});

export function RoutePostListComponent() {
  return <div>Hello "/layouts/posts/"!</div>;
}
