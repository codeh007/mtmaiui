"use client";

import { useMutation } from "@tanstack/react-query";
// import { tenantDefaultSettingMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../../../hooks/useAuth";

interface SetDefaultSettingBtnProps {
  tenantSettingId: string;
}
export function SetDefaultSettingBtn({ tenantSettingId }: SetDefaultSettingBtnProps) {
  const tid = useTenantId();
  const updateTenantSetting = useMutation({
    ...tenantDefaultSettingMutation({}),
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          updateTenantSetting.mutate({
            path: {
              tenant: tid,
              setting: tenantSettingId,
            },
          });
        }}
      >
        设为默认配置
      </Button>
    </>
  );
}
