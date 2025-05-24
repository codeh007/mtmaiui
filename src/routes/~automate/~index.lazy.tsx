import { createLazyFileRoute } from "@tanstack/react-router";
import DemoRunCodeForm from "./DemoRunCodeForm";

export const Route = createLazyFileRoute("/automate/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DemoRunCodeForm />
    </div>
  );
}
