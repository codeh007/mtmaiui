import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  tenantSettingsListQueryKey,
  tenantSettingsUpsertMutation,
} from "mtmaiapi";
import { Icons } from "mtxuilib/icons/icons";
import { generateUUID } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import { toast } from "sonner";
import { useTenantId } from "../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/tenant/settings/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const queryClient = useQueryClient();
  const upsertTenantSetting = useMutation({
    ...tenantSettingsUpsertMutation(),
    onSuccess: () => {
      toast.success("创建成功");
      queryClient.invalidateQueries({
        queryKey: tenantSettingsListQueryKey({ path: { tenant: tid } }),
      });
    },
  });

  const handleCreateDefault = () => {
    upsertTenantSetting.mutate({
      path: {
        tenant: tid,
        setting: generateUUID(),
      },
      body: {
        // type: "default",
      },
    });
  };

  return (
    <>
      <h1> tenant settings new</h1>

      <Button onClick={handleCreateDefault}>
        <Icons.plus className="size-4" />
        立即创建默认
      </Button>
    </>
  );
}
