"use client";

import { httpUrlToWsUrl } from "mtxuilib/lib/utils";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import type { ITerminal } from "../../types/terminal";

export interface MtmaiBotProps {
  isDev?: boolean;
  wsUrl: string;
  initCmd?: string;
}

export const defaultMessageContext = {};

export interface MtmaiState extends MtmaiBotProps {
  _hasHydrated?: boolean;
  socket?: WebSocket | null;
  setSocket: (socket: WebSocket | null) => void;

  connected: boolean;
  setConnected: (connected: boolean) => void;

  connecting: boolean;
  setConnecting: (connecting: boolean) => void;

  error?: string;
  setError: (error: string) => void;

  listItem: string[];
  setListItem: (listItem: string[]) => void;

  cmd: string;
  setCmd: (cmd: string) => void;

  // executeCommand: (cmd: string) => void;
  connect: () => void;
  send: (cmd: string) => void;

  terminal?: ITerminal;
  attachTerminal: (terminal: ITerminal) => void;
}

export const createAppSlice: StateCreator<MtmaiState, [], [], MtmaiState> = (
  set,
  get,
  init,
) => {
  return {
    isDev: false,
    setSocket: (socket: WebSocket | null) => {
      set({ socket });
    },
    setConnected: (connected: boolean) => {
      set({ connected });
    },
    setConnecting: (connecting: boolean) => {
      set({ connecting });
    },
    setError: (error) => {
      set({ error });
    },
    listItem: [],
    setListItem: (listItem) => {
      set({ listItem });
    },
    setCmd: (cmd) => {
      set({ cmd });
    },
    connect: () => connectWs(null, set, get),
    send: async (cmd) => {
      let ws = get().socket;
      if (!ws) {
        await connectWs(null, set, get);
      }
      ws = get().socket;
      if (ws) {
        ws.send(cmd);
      }
    },
    attachTerminal: (terminal: ITerminal) => {
      set({ terminal });
      let pasteInProgress = false;
      let pasteContent = "";

      terminal.onData((data) => {
        //TODO: 这里的复制粘贴功能 没有正确完成
        if (data === "\x1b[200~") {
          // 粘贴开始
          pasteInProgress = true;
          pasteContent = "";
        } else if (data === "\x1b[201~") {
          // 粘贴结束，发送累积的内容
          pasteInProgress = false;
          if (pasteContent) {
            get().send(pasteContent);
          }
        } else if (pasteInProgress) {
          // 累积粘贴的内容
          pasteContent += data;
        } else {
          // 普通输入
          const convertedData = data.replace(/\r/g, "\r\n");
          get().send(convertedData);
        }
      });
    },
  };
};

type mtappStore = ReturnType<typeof createMtAppStore>;
export type MainStoreState = MtmaiState;

const createMtAppStore = (initProps?: Partial<MainStoreState>) => {
  const initialState = { ...initProps };
  return createStore<MainStoreState>()(
    subscribeWithSelector(
      devtools(
        immer((...a) => ({
          ...createAppSlice(...a),
          ...initialState,
        })),
        {
          name: "xterm-store",
        },
      ),
    ),
  );
};
export const mtmaiStoreContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<MtmaiBotProps>;
export const XtermProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createMtAppStore(etc), [etc]);

  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useXtermStore(): MainStoreState;
export function useXtermStore<T>(selector: (state: MainStoreState) => T): T;
export function useXtermStore<T>(selector?: (state: MainStoreState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useXtermStore must in MtmaiProviderV2");
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

export const connectWs = (
  params,
  set: (
    partial:
      | Partial<MainStoreState>
      | ((state: MainStoreState) => Partial<MainStoreState>),
  ) => void,
  get: () => MainStoreState,
) => {
  const handleWebSocketMessage = (event: MessageEvent) => {
    const processText = (text: string) => {
      const newLines = text.split(/\r?\n/).filter((line) => line.length > 0);
      set({ listItem: [...get().listItem, ...newLines] });
      get().terminal?.write(text);
    };

    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        processText(reader.result as string);
      };
      reader.readAsText(event.data);
    } else {
      console.log("event.data(String)", event.data);
      processText(event.data);
    }
  };
  return new Promise((resolve, reject) => {
    if (!get().socket) {
      const newSocket = new WebSocket(`${httpUrlToWsUrl(get().wsUrl)}`);
      set({ socket: newSocket });
    }

    const ws = get().socket;
    if (!ws) {
      return;
    }

    // 连接打开
    ws.onopen = () => {
      console.log("WebSocket connected");
      set({ connected: true });
      set({ connecting: false });
      set({ error: undefined });
    };

    // 错误处理
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      set({ error: "WebSocket 连接错误" });
      set({ connecting: false });
      set({ connected: false });
    };
    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      set({ connected: false });
      set({ connecting: false });
      set({
        error: event.code === 1000 ? undefined : `连接已关闭 (${event.code})`,
      });
    };
    ws.onmessage = (event) => {
      handleWebSocketMessage(event);
    };
  });
};
