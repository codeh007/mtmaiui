"use client";

import type { FrontendConfig, Site, Tenant } from "mtmaiapi";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useSessionLoader } from "../hooks/useAuth";
import ReactQueryProvider from "./ReactQueryProvider";
type ViewOptions = "graph" | "minimap";
const lastTimeRange = "lastTimeRange";
const lastTenantKey = "lastTenant";
interface MtmaiBotProps {
  hostName?: string;
  serverUrl?: string;
  selfBackendUrl?: string;
  accessToken?: string;
  frontendConfig?: FrontendConfig;
  isDebug?: boolean;
}
interface MtmaiState extends MtmaiBotProps {
  _hasHydrated?: boolean;
  activeView?: string;
  debug?: boolean;
  cacheEnabled?: boolean;
  setFrontendConfig: (frontendConfig: FrontendConfig) => void;
  setHasHydrated: (_hasHydrated: boolean) => void;
  setDebug: (debug?: boolean) => void;
  setServerUrl: (serverUrl: string) => void;
  setHostName: (hostName: string) => void;
  setAccessToken: (accessToken: string) => void;
  setSelfBackendUrl: (selfBackendUrl: string) => void;
  site?: Site;
  setSite: (site: Site) => void;
  setIsDebug: (isDebug: boolean) => void;
  lastTenant?: Tenant;
  setLastTenant: (tenant: Tenant) => void;
  currentTenant?: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  lastTimeRange: string;
  setLastTimeRange: (timeRange: string) => void;
  preferredWorkflowRunView: ViewOptions;
  setPreferredWorkflowRunView: (view: ViewOptions) => void;
}

const createAppSlice: StateCreator<MtmaiState, [], [], MtmaiState> = (set, get, init) => {
  return {
    debug: false,
    serverUrl: "",
    ...init,
    setHasHydrated: (_hasHydrated: boolean) => set({ _hasHydrated }),
    setFrontendConfig: (frontendConfig: FrontendConfig) => set({ frontendConfig }),
    setDebug: (debug) => set({ debug }),
    setServerUrl: (serverUrl) => set({ serverUrl }),
    setHostName: (hostName) => set({ hostName }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setSite: (site) => set({ site }),
    setSelfBackendUrl: (selfBackendUrl) => set({ selfBackendUrl }),
    setIsDebug: (isDebug) => set({ isDebug }),
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
  };
};

type mtappStore = ReturnType<typeof createMtAppStore>;
type MainStoreState = MtmaiState;

const createMtAppStore = (initProps?: Partial<MainStoreState>) => {
  const initialState = { ...initProps };
  return createStore<MainStoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createAppSlice(...a),
          // ...createHatchetSlice(...a),
          ...initialState,
        })),
        {
          name: "Mtmai-store",
        },
      ),
      // {
      // 	name: "Mtmai-store",
      // 	skipHydration: true,
      // 	version: 3,
      // 	onRehydrateStorage: () => (state, error) => {
      // 		state?.setHasHydrated(true);
      // 		// console.log("onRehydrateStorage", state, error);
      // 		if (error) {
      // 			console.error("onRehydrateStorage error", error);
      // 		}
      // 	},
      // 	partialize: (state) => {
      // 		return Object.fromEntries(
      // 			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
      // 			Object.entries(state as any).filter(([key, value]) => {
      // 				// Exclude specific keys
      // 				if (
      // 					[
      // 						"cookieStr",
      // 						"children",
      // 						"openFab",
      // 						"userInfo",
      // 						"_hasHydrated",
      // 						"socket",
      // 						"session",
      // 					].includes(key)
      // 				) {
      // 					return false;
      // 				}

      // 				// Check if the value is a React component or other non-serializable type
      // 				if (
      // 					React.isValidElement(value) ||
      // 					typeof value === "function" ||
      // 					value instanceof Element ||
      // 					value instanceof Node
      // 				) {
      // 					return false;
      // 				}
      // 				return true;
      // 			}),
      // 		);
      // 	},
      // },
      // ),
    ),
  );
};
const mtmaiStoreContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<MtmaiBotProps>;
export const MtmaiProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createMtAppStore(etc), []);

  useHotkeys(
    "alt+.",
    () => {
      mystore.setState({ isDebug: !mystore.getState().isDebug });
    },
    [mystore],
  );
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      <ReactQueryProvider
        serverUrl={mystore.getState().serverUrl}
        accessToken={mystore.getState().accessToken as string}
        host={mystore.getState().hostName as string}
        debug={mystore.getState().isDebug}
      >
        <MtSession>{children}</MtSession>
      </ReactQueryProvider>
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useMtmai(): MainStoreState;
export function useMtmai<T>(selector: (state: MainStoreState) => T): T;
export function useMtmai<T>(selector?: (state: MainStoreState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useMtmai must in MtmaiProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}

const MtSession = ({ children }: { children: React.ReactNode }) => {
  useSessionLoader();
  return <>{children}</>;
};
