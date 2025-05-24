import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PlatformAccountFields } from "../../fields/PlatformAccountFields";
export const Route = createLazyFileRoute("/resource/new/res/platform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useFormContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.reset();
    form.setValue("type", "platform_account");
    form.setValue("title", "账号");
  }, []);

  return (
    <div className="flex flex-col h-full w-full px-2 space-y-2">
      <PlatformAccountFields />
    </div>
  );
}
