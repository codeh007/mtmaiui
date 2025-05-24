import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
// import { tenantSettingsGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZFormField } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import { useTenantId } from "../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/tenant/settings/$tenantSettingId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantSettingId } = Route.useParams();
  const tid = useTenantId();
  const query = useSuspenseQuery({
    ...tenantSettingsGetOptions({
      path: {
        tenant: tid,
        setting: tenantSettingId,
      },
    }),
  });

  const form = useFormContext();
  return (
    <>
      <DebugValue data={query.data} />

      <ZFormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>标题</FormLabel>
            <FormControl>
              <Input placeholder="标题222" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
