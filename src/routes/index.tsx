import { createFileRoute } from "@tanstack/react-router";
export * from "./posts/index";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!V4</h3>
    </div>
  );
}
