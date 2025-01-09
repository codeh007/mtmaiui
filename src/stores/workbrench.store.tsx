"use client";

import { type ChangeEvent, createContext, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
// import {
//   addMessage,
//   deleteMessageById,
//   updateMessageById,
//   updateMessageContentById,
// } from "../../../../apps/mtmaiadmin/src/lib/messageUtils";

import type {
  AssisantMenus,
  AssisantWorkbenchConfig,
  Message,
  ThreadUIState,
} from "mtmaiapi";
import type React from "react";

import { debounce } from "lodash";
// import type { ThreadForm } from "mtmaiapi";
import type { Tenant } from "mtmaiapi/api";
import type { components } from "mtmaiapi/query_client/generated";
import { io } from "socket.io-client";
import type { Suggestion } from "../db/schema";
import { addMessage, deleteMessageById, updateMessageById, updateMessageContentById } from "../lib/messageUtils";
import type {
  IAction,
  IAsk,
  IFileRef,
  IInputHistory,
  IMessageElement,
  IStep,
  ITasklistElement,
  IThread,
  IToken,
} from "../types";
import type { HubmanInput } from "../types/hatchet-types";
import { subscribeSse } from "./eventHandler";
import { handleSseSubmit } from "./handleSubmit";
export interface IAskForm {
  callback: (data) => void;
  askForm: ThreadForm;
}
export interface WorkbenchProps {
  backendUrl: string;
  accessToken?: string;
  chatProfile?: string;
  params?: Record<string, any>;
  // assisantConfig?: AssisantConfig;
  // onFnCalls?: (fn_call: ICallFn) => any;
  // autoConnectWs?: boolean;
  openDebugPanel?: boolean;
  threadId?: string;
  tenant: Tenant;
}
export type StreamingDelta = {
  type: "text-delta" | "title" | "id" | "suggestion" | "clear" | "finish";
  content: string | Suggestion;
};

// 新增聊天事件类型
export type MtmaiChatEvent = {
  type: "newChatId" | "chatEnd";
  data: any;
};

export interface WorkbrenchState extends WorkbenchProps {
  setThreadId: (threadId: string) => void;
  isOpenWorkbenchChat: boolean;
  setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => void;
  setOpenDebugPanel: (openDebugPanel: boolean) => void;
  workbenchViewProps?: Record<string, any>;
  setWorkbenchViewProps: (props?: Record<string, any>) => void;
  // currentView: string;
  // setCurrentView: (view: string) => void;

  workbenchConfig: AssisantWorkbenchConfig | undefined;
  // setWorkbenchConfig: (config: AssisantWorkbenchConfig) => void;
  // setAssisantConfig: (config: AssisantConfig) => void;
  openWorkbench: (viewName: string, viewProps?: Record<string, any>) => void;
  // started: boolean;
  // setStarted: (started: boolean) => void;
  // aborted: boolean;
  // setAborted: (aborted: boolean) => void;
  //--------------------------------------------------------------------------------------
  // useChat 状态提升到这里
  appendChatMessageCb?: (message) => void;
  //--------------------------------------------------------------------------------------
  messages: IStep[];
  setMessages: (messagesState: IStep[]) => void;

  setAccessToken: (accessToken: string) => void;
  // setParams: (params: Record<string, any>) => void;
  messageParser?: (messages: Message[]) => void;
  setMessageParser: (messageParser: (messages: Message[]) => void) => void;
  // input: string;
  // setInput: (input: string) => void;
  handleAisdkInputChange:
    | ((event: ChangeEvent<HTMLTextAreaElement>) => void)
    | undefined;
  //-----------------------------------
  setShowWorkbench: (openWorkbench: boolean) => void;
  setOpenChat: (openChat: boolean) => void;
  openView: (
    viewName: string,
    viewProps?: Record<string, any>,
    target?: AssisantMenus["target"],
  ) => void;
  setCurrentWorkbenchView: (id: string) => void;

  //--------------------------------------------------------------------------------------------
  // socket?: Socket | null;
  // setSocket: (socket: Socket | null) => void;
  // messageContext: IMessageContext;
  // setMessageContext: (messageContext: IMessageContext) => void;

  chatEndpoint: string;
  setChatEndpoint: (chatEndpoint: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  // ws 是否可以启动连接
  // canConnect?: boolean;
  // setCanConnect: (canConnect: boolean) => void;

  inputHistoryState: IInputHistory; // inputHistoryState 不知具体作用
  setInputHistoryState: (inputHistoryState: IInputHistory) => void;
  onUpdateMessage: (message: IStep) => void;
  onNewMessage: (message: IStep) => void;

  onDeleteMessage: (message: IStep) => void;
  onStreamStart: (message: IStep) => void;
  onStreamToken: (token: IToken) => void;
  onAsk: (message: IStep) => void;

  uiState: ThreadUIState;
  setUiState: (uiState) => void;
  sessionId: string;
  setSessionId: (sessionId: string) => void;

  firstUserInteraction?: string;
  setFirstUserInteraction: (firstUserInteraction: string) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  askUser?: IAsk;
  setAskUser: (askUserState?: IAsk) => void;

  askForm?: IAskForm;
  setAskForm: (askForm?: IAskForm) => void;

  elementState: IMessageElement[];
  setElementState: (elementState: IMessageElement[]) => void;

  //在侧边栏 显示的单个 element
  sideViewState?: IMessageElement;
  setSideViewState: (sideViewState?: IMessageElement) => void;

  tasklistState: ITasklistElement[];
  setTasklistState: (tasklistState: ITasklistElement[]) => void;

  actionState: IAction[];
  setActionState: (actionState: IAction[]) => void;
  // connectWs: () => void;
  askUserState?: IAsk;
  setAskUserState: (askUserState?: IAsk) => void;
  chatProfile?: string;
  setChatProfile: (chatProfileState?: string) => void;
  setChatProfileId: (chatProfileId: string) => void;

  handleHumanInput: (input: HubmanInput) => void;

  mtrouter: { push: (path: string) => void };
  isWs?: boolean;
  setIsWs: (isWs: boolean) => void;
  handleEvents: (eventName: string, data: any) => void;
  chatBotType: "";
  nodeState?: components["schemas"]["AgentNode"];
  subscribeEvents: (options: {
    runId: string;
  }) => void;
  resource?: string;
  setResource: (resource: string) => void;
  resourceId?: string;
  setResourceId: (resourceId: string) => void;
}

export const createWorkbrenchSlice: StateCreator<
  WorkbrenchState,
  [],
  [],
  WorkbrenchState
> = (set, get, init) => {
  return {
    isDev: false,
    backendUrl: "",
    nodeState: undefined,
    chatEndpoint: "/api/v1/chat/ws/socket.io",
    // use chat ----------------------------------------------------------------------------
    appendChatMessageCb: (message) => {
      // set({ messages: [...get().messages, message] });
      console.log("append", message);
    },
    setOpenDebugPanel: (openDebugPanel) => set({ openDebugPanel }),
    currentView: "",
    setCurrentView: (view) => set({ currentView: view }),
    workbenchConfig: undefined,
    setWorkbenchConfig: (config) => set({ workbenchConfig: config }),
    workbenchViewProps: {},
    setWorkbenchViewProps: (props) => set({ workbenchViewProps: props }),
    assisantConfig: undefined,
    setAssisantConfig: (config) => set({ assisantConfig: config }),

    setIsWs: (isWs) => set({ isWs }),
    //---------------------------------------------------------------------------------------------

    messages: [],
    elementState: [],
    setElementState: (elementState) => {
      set({ elementState });
    },
    actionState: [],
    setActionState: (actionState) => {
      set({ actionState });
    },
    input: "",
    firstUserInteraction: undefined,
    setFirstUserInteraction: (firstUserInteraction) =>
      set({ firstUserInteraction }),
    uiState: {},
    setUistate: (uiState) => {
      set({ uiState });
    },
    setInput: (input: string) => {
      set({ input });
    },
    setAccessToken: (accessToken: string) => {
      set({ accessToken });
    },
    setParams: (params: Record<string, any>) => {
      set({ params });
    },
    setMessageParser: (messageParser: (messages: Message[]) => void) => {
      set({ messageParser });
    },

    handleAisdkInputChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
      set({ input: event.target.value }),
    handleHumanInput: debounce(async ({ message, resource, resourceId }) => {
      set({ input: message, resource, resourceId });
      const newStep: IStep = {
        threadId: "",
        id: uuidv4(),
        name: "User", //实际的用户名
        type: "user_message",
        output: message,
        createdAt: new Date().toISOString(),
      };
      set({ messages: [...(message || []), newStep] });
      if (get().isWs) {
        const fileReferences: IFileRef[] = [];
        if (!get().socket?.connected) {
          await get().connectWs();
        }
        const latestMessages = get().messages[get().messages.length - 1];
        get().socket?.emit("client_message", {
          message: latestMessages,
          fileReferences,
        });
      } else {
        handleSseSubmit(set, get);
      }
    }, 200),
    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) =>
      set({ uiState: { ...get().uiState, openWorkbench } }),
    setOpenChat: (openChat) => {
      set({ uiState: { ...get().uiState, openChat: openChat } });
    },
    setStarted: (started) => set({ started }),
    setAborted: (aborted) => set({ aborted }),
    setThreadId: (threadId: string) => {
      set({ threadId });
      console.log("setThreadId", threadId);
    },
    isOpenWorkbenchChat: false,
    setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => {
      set({ isOpenWorkbenchChat });
    },
    openView: (viewName, viewProps, targetView) => {
      console.log("openListView", viewName, viewProps, targetView);
      const target = targetView || "workbench";
      if (target === "asider") {
        console.log("todo openListView asider");
      } else if (targetView === "workbench") {
        set({
          uiState: {
            ...get().uiState,
            openWorkbench: true,
            // currentWorkbenchView: viewName,
          },
          // currentWorkbenchView: viewName,
          workbenchViewProps: viewProps,
        });
      } else if (targetView === "cmdk") {
        console.log("todo openListView cmdk");
      }
    },
    setCurrentWorkbenchView: (viewName: string) => {
      set({
        uiState: {
          ...get().uiState,
          // currentWorkbenchView: viewName,
        },
      });
    },
    openWorkbench: (viewName, viewProps) => {
      console.log("openWorkbench", viewName, viewProps);
      set({
        uiState: {
          ...get().uiState,
          openWorkbench: true,
          // currentWorkbenchView: viewName,
        },
        workbenchViewProps: viewProps,
      });
    },

    connect: async () => {
      // 拉取消息
      console.log("拉取消息 connect");
      const response = await fetch(
        `${get().backendUrl}/api/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${get().accessToken}`,
          },
          body: JSON.stringify({
            messages: [],
            chatProfile: get().chatProfile,
            isChat: true,
            params: get().params,
            isPull: true,
          }),
        },
      );
      if (response.ok) {
      }
    },
    setIsConnected: (isConnected) => set({ isConnected }),
    setSocket: (socket) => set({ socket }),
    connectWs: () => connectWs(null, set, get),
    onNewMessage: (message) => {
      const preMessages = get().messages;
      const newMessages = addMessage(preMessages, message);
      set({ messages: newMessages });
    },
    onUpdateMessage: (message) => {
      const preMessages = get().messages;
      const newMessages = updateMessageById(preMessages, message.id, message);
      set({ messages: newMessages });
    },
    onDeleteMessage: (msg) => {
      const newMessages = deleteMessageById(get().messages, msg.id);
      set({ messages: newMessages });
    },

    setAskUserState: (askUserState) => set({ askUserState }),
    setChatProfile: (chatProfile) => set({ chatProfile }),
    subscribeEvents: (options) => subscribeSse(options, set, get),
    setResource: (resource) => set({ resource }),
    setResourceId: (resourceId) => set({ resourceId }),
    ...init,
  };
};

type mtappStore = ReturnType<typeof createWordbrenchStore>;
export type WorkbrenchStoreState = WorkbrenchState;

const createWordbrenchStore = (initProps?: Partial<WorkbrenchStoreState>) => {
  return createStore<WorkbrenchStoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          // ...createMessageParserSlice(...a),
          ...initProps,
        })),
        {
          name: "workbench-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<WorkbenchProps>;
export const WorkbrenchProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createWordbrenchStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkbrenchStore(): WorkbrenchStoreState;
export function useWorkbrenchStore<T>(
  selector: (state: WorkbrenchStoreState) => T,
): T;
export function useWorkbrenchStore<T>(
  selector?: (state: WorkbrenchStoreState) => T,
) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useWorkbrenchStore must in WorkbrenchProvider");
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

const connectWs = (
  params,
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
  get: () => WorkbrenchState,
) => {
  return new Promise((resolve, reject) => {
    let ws = get().socket;
    if (ws?.connected) {
      resolve(true);
    } else {
      if (!ws) {
        const baseUrl = get().backendUrl;
        const { protocol, host, pathname } = new URL(
          `${baseUrl}${get().chatEndpoint}`,
        );
        const uri = `${protocol}//${host}`;

        const chatProfile = get().chatProfile;
        console.log("sio connect", {
          uri,
          pathname,
          chatProfile,
          threadId: get().threadId,
        });
        ws = io(uri, {
          path: pathname,
          autoConnect: true,
          extraHeaders: {
            ...(get().accessToken && {
              Authorization: `Bearer ${get().accessToken}`,
            }),
            "X-Chainlit-Chat-Profile": get().chatProfile || "",
            "user-env": JSON.stringify({}),
            "X-Chainlit-Client-Type": "web_app",
            "X-Chainlit-Session-Id": get().sessionId || "",
            "X-Chainlit-Thread-Id": get().threadId || "",
          },
        });
        get().setSocket(ws);
        get().socket?.on("connect", () => {
          console.log("emit connection_successful", {
            threadId: get().threadId,
          });
          get().socket?.emit("connection_successful");
          get().setIsConnected(true);
          resolve(true);
        });
        get().socket?.on("connect_error", (error) => {
          console.error("ws connect error", error);
        });
        get().socket?.on("disconnect", () => {
          console.warn("ws disconnect");
          get().setIsConnected(false);
        });
        get().socket?.on(
          "first_interaction",
          (data: { interaction: string; thread_id: string }) => {
            console.log("first_interaction", data);
            get().setThreadId(data.thread_id);
            get().setFirstUserInteraction(data.interaction);
            get().setStarted(true);
            // const url = new URL(window.location.href);
            // 提示：前端不做路由跳转，路由跳转功能由后端控制
            // url.pathname = `/dash/chat-profile/${chatProfileId}/thread/${data.thread_id}`;
            // window.history.replaceState({}, "", url);
          },
        );
        get().socket?.on("new_message", (data) => {
          get().onNewMessage(data);
        });
        get().socket?.on("update_message", (data) => {
          get().onUpdateMessage(data);
        });
        get().socket?.on("delete_message", (data) => {
          get().onDeleteMessage(data);
        });
        get().socket?.on("thread_ui_state", (data) => {
          console.log("thread_ui_state", data);
          get().setUiState(data);
        });
        get().socket?.on("stream_start", (message) => {
          console.log("stream_start", message);
          const preMessages = get().messages;
          const newMessage = addMessage(preMessages, message);
          get().setMessages(newMessage);
        });
        get().socket?.on(
          "stream_token",
          ({ id, token, isSequence, isInput }: IToken) => {
            const preMessages = get().messages;
            const newMessage = updateMessageContentById(
              preMessages,
              id,
              token,
              isSequence,
              isInput,
            );
            get().setMessages(newMessage);
          },
        );
        get().socket?.on("ask", (data) => {
          console.log("ask", data);
          get().setAskUserState(data);
        });
        get().socket?.on("ask_timeout", (data) => {
          console.log("ask_timeout", data);
          get().setAskUserState(undefined);
          get().setLoading(false);
        });
        get().socket?.on("clear_ask", (data) => {
          get().setAskUserState(undefined);
        });
        get().socket?.on("clear_call_fn", (data) => {
          console.warn("clear_call_fn", data);
        });
        get().socket?.on("call_fn_timeout", (data) => {
          console.warn("call_fn_timeout", data);
        });
        get().socket?.on("ask_form", ({ formData, callback }) => {
          //自定义表单
          // console.log("ask_form", data);
          get().setAskForm({
            askForm: formData,
            callback,
          });
        });
        get().socket?.on("clear_ask_form", (data) => {
          // //这个是自定义的事件，不是 chainlit 自带的事件，现在 看起来没什么用了。
          get().setAskForm(undefined);
        });
        get().socket?.on("chat_settings", (data) => {
          console.log("TODO: chat_settings", data);
        });
        get().socket?.on("chat_settings_update", (data) => {
          console.log("chat_settings_update", data);
        });
        get().socket?.on("resume_thread", (thread: IThread) => {
          console.warn("resume_thread", thread);
          get().setMessages(thread.steps);
          // const elements = thread.elements || [];
        });
        get().socket?.on("element", (element) => {
          if (element.type === "tasklist") {
            console.warn("TODO: 处理 tasklist 元素", element);
          } else {
            const index = get().elementState.findIndex(
              (e) => e.id === element.id,
            );
            console.log("处理 element", index, element);

            if (index === -1) {
              get().setElementState([...get().elementState, element]);
            } else {
              get().setElementState([
                ...get().elementState.slice(0, index),
                element,
                ...get().elementState.slice(index + 1),
              ]);
            }
          }
        });
        get().socket?.on("remove_element", (element) => {
          console.log("remove_element", element);
        });
        get().socket?.on("action", (action) => {
          console.log("action", action);
        });
        get().socket?.on("remove_action", (action) => {
          console.log("remove_action", action);
        });
        get().socket?.on("token_usage", (data) => {
          console.log("token_usage", data);
        });
        get().socket?.on("ui_state_upate", (data) => {
          console.log("ui_state_upate", data);
          get().setUiState({
            ...get().uiState,
            ...data,
          });
        });
        get().socket?.on("logs", (data) => {
          console.log("[backend] logs", data);
        });
        get().socket?.on("reload", (data) => {
          console.log("reload", data);
        });
        get().socket?.on("mtroute", (data) => {
          console.log("[evt]mtroute", data);
          get().mtrouter.push(data.path);
        });
      }
    }
  });
};
