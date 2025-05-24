"use client";

import type { Tenant } from "mtmaiapi";
import type { StateCreator } from "zustand";
export const lastTenantKey = "lastTenant";

const lastTimeRange = "lastTimeRange";

type ViewOptions = "graph" | "minimap";
export interface AuthProps {
  accessToken?: string;
}

export const defaultMessageContext = {};

export interface HatchetSliceState extends AuthProps {
  lastTenant?: Tenant;
  setLastTenant: (tenant: Tenant) => void;
  currentTenant?: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  lastTimeRange: string;
  setLastTimeRange: (timeRange: string) => void;
  preferredWorkflowRunView: ViewOptions;
  setPreferredWorkflowRunView: (view: ViewOptions) => void;
}

export const createHatchetSlice: StateCreator<
  HatchetSliceState,
  [],
  [],
  HatchetSliceState
> = (set, get, init) => {
  return {
    setLastTenant: (tenant: Tenant) => {
      set({ lastTenant: tenant });
      localStorage.setItem(lastTenantKey, JSON.stringify(tenant));
    },
    setCurrentTenant: (tenant: Tenant) => {
      set({ currentTenant: tenant });
    },
    lastTimeRange: "1h",
    setLastTimeRange: (timeRange: string) => {
      set({ lastTimeRange: timeRange });
      localStorage.setItem(lastTimeRange, JSON.stringify(timeRange));
    },
    preferredWorkflowRunView: "minimap",
    setPreferredWorkflowRunView: (view: ViewOptions) => {
      set({ preferredWorkflowRunView: view });
    },
    ...init,
  };
};
