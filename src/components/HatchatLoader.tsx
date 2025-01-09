"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { tenantMembershipsListOptions } from "mtmaiapi";
import { useSearchParams } from "next/navigation";
import { type PropsWithChildren, useEffect, useMemo } from "react";
import { useMtmaiV2 } from "../stores/StoreProvider";

/**
 * 完成最基本数据的加载
 * @param props
 * @returns
 */
export function HatchatLoader(props: PropsWithChildren) {
  const { children } = props;
  const searchParams = useSearchParams();
  const currentTenant = useMtmaiV2((x) => x.currentTenant);
  const setCurrentTenant = useMtmaiV2((x) => x.setCurrentTenant);
  const lastTenant = useMtmaiV2((x) => x.lastTenant);
  const listMembershipsQuery = useSuspenseQuery({
    ...tenantMembershipsListOptions(),
  });

  const memberships = useMemo(() => {
    return listMembershipsQuery.data?.rows || [];
  }, [listMembershipsQuery]);

  const computedCurrTenant = useMemo(() => {
    const findTenant = (tenantId: string) => {
      return memberships?.find((m) => m.tenant?.metadata.id === tenantId)
        ?.tenant;
    };

    const currTenantId = searchParams.get("tenant") || undefined;

    if (currTenantId) {
      const tenant = findTenant(currTenantId);

      if (tenant) {
        return tenant;
      }
    }

    const lastTenantId = lastTenant?.metadata.id || undefined;

    if (lastTenantId) {
      const tenant = findTenant(lastTenantId);

      if (tenant) {
        return tenant;
      }
    }

    const firstMembershipTenant = memberships?.[0]?.tenant;

    return firstMembershipTenant;
  }, [memberships, lastTenant?.metadata.id, searchParams]);

  useEffect(() => {
    // 当computedCurrTenant有值，且currentTenant没有值时，设置currentTenant
    if (computedCurrTenant && !currentTenant) {
      setCurrentTenant(computedCurrTenant);
    }
  }, [computedCurrTenant, currentTenant, setCurrentTenant]);

  return <>{currentTenant ? children : <div>Loading tenant...</div>}</>;
}
