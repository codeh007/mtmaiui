"use client";

import type { FrontendConfig, Site } from "mtmaiapi";
import { DevTools } from "mtxuilib/components/devtools/DevTools";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import ReactQueryProvider from "./ReactQueryProvider";
import { type HatchetSliceState, createHatchetSlice } from "./hatchet.slice";

interface MtmaiBotProps {
  hostName?: string | null;
  serverUrl?: string | null;
  accessToken?: string | null;
  frontendConfig?: FrontendConfig;
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
  site?: Site;
  setSite: (site: Site) => void;
}

const createAppSlice: StateCreator<MtmaiState, [], [], MtmaiState> = (
  set,
  get,
  init,
) => {
  return {
    debug: false,
    serverUrl: "",
    ...init,
    setHasHydrated: (_hasHydrated: boolean) => set({ _hasHydrated }),
    setFrontendConfig: (frontendConfig: FrontendConfig) =>
      set({ frontendConfig }),
    setDebug: (debug) => set({ debug }),
    setServerUrl: (serverUrl) => set({ serverUrl }),
    setHostName: (hostName) => set({ hostName }),
    setAccessToken: (accessToken) => set({ accessToken }),
    setSite: (site) => set({ site }),
  };
};

type mtappStore = ReturnType<typeof createMtAppStore>;
type MainStoreStateV2 = MtmaiState & HatchetSliceState;

const createMtAppStore = (initProps?: Partial<MainStoreStateV2>) => {
  const initialState = { ...initProps };
  return createStore<MainStoreStateV2>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createAppSlice(...a),
          // ...createDashSlice(...a),
          // ...createCopilotSlice(...a),
          // ...createCoreSlice(...a),
          // ...createSiderbarSlice(...a),
          ...createHatchetSlice(...a),
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

  return (
    <mtmaiStoreContext.Provider value={mystore}>
      <ReactQueryProvider
        serverUrl={etc.serverUrl as string}
        accessToken={etc.accessToken as string}
        host={etc.hostName as string}
      >
        {children}
        <DevTools />
      </ReactQueryProvider>
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useMtmaiV2(): MainStoreStateV2;
export function useMtmaiV2<T>(selector: (state: MainStoreStateV2) => T): T;
export function useMtmaiV2<T>(selector?: (state: MainStoreStateV2) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useMtmaiV2 must in MtmaiProviderV2");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(
      store,
      DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
