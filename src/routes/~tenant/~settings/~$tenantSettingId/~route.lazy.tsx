import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
// import { tenantSettingsGetOptions, tenantSettingsUpsertMutation } from "mtmaiapi";
// import { zTenantSettingUpsert } from "mtmaiapi/gomtmapi/zod.gen";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { useTenantId } from "../../../../hooks/useAuth";
import { TenantSettingHeader } from "./header";

export const Route = createLazyFileRoute("/tenant/settings/$tenantSettingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const { tenantSettingId } = Route.useParams();

  const tenantSettingQuery = useSuspenseQuery({
    ...tenantSettingsGetOptions({
      path: {
        tenant: tid,
        setting: tenantSettingId,
      },
    }),
  });

  const updateTenantSetting = useMutation({
    ...tenantSettingsUpsertMutation({}),
  });

  const form = useZodFormV2({
    schema: zTenantSettingUpsert,
    defaultValues: {
      ...tenantSettingQuery.data,
    },
    handleSubmit: (data) => {
      updateTenantSetting.mutate({
        path: {
          tenant: tid,
          setting: tenantSettingId,
        },
        body: { ...data },
      });
    },
    toastValidateError: true,
  });
  return (
    <>
      <TenantSettingHeader />
      <Tabs defaultValue="visualization" className="w-full">
        <TabsList layout="underlined">
          <CustomLink to=".">
            <TabsTrigger variant="underlined" value="visualization">
              任务配置
            </TabsTrigger>
          </CustomLink>
          <CustomLink to="team_builder/team">
            <TabsTrigger variant="underlined" value="team">
              模型配置
            </TabsTrigger>
          </CustomLink>
        </TabsList>
      </Tabs>
      <ZForm {...form} className="px-2">
        <Outlet />
      </ZForm>
      <ZFormToolbar {...form} />
    </>
  );
}
