"use client";

import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { Message } from "ai";
import { debounce } from "lodash";
import { useHotkeys } from "react-hotkeys-hook";

import type { RootAgentState } from "@mtmaiui/agent_state/root_agent_state";
import {
  type AdkEvent,
  // type AgentRunRequestV3,
  type ApiErrors,
  // type ChatMessage,
  // type ChatMessageList,
  type Content,
  // type FlowTeamInput,
  type Options,
  // type RootAgentState,
  // type SocialTeam,
  // type SocialTeamManagerState,
  type Tenant,
  type WorkflowRun,
  type WorkflowRunCreateData,
  // adkEventsListOptions,
  // adkSessionGet,
  workflowRunCreateMutation,
} from "mtmaiapi";
import { generateUUID } from "mtxuilib/lib/utils";
import type React from "react";
import { createContext, useContext, useMemo, useTransition } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import type { ChatAgentOutgoingMessage, ChatAgentState } from "../agent_state/chat_agent_state";
import { parseEventStream } from "../agent_utils/agent_utils";
import data from "../data/ig_settings_xiaoto33.json";
import { useTenant, useTenantId } from "../hooks/useAuth";
import { handleAgentOutgoingEvent } from "./ag-event-handlers";
// import { exampleTeamConfig } from "./exampleTeamConfig";

const DEFAULT_APP_NAME = "chat";
const DEFAULT_AGENT_URL = "https://mtmag.yuepa8.com";
export interface WorkbenchProps {
  sessionId?: string;
}
export interface WorkbrenchState extends WorkbenchProps {
  agentUrl: string;
  setAgentUrl: (agentUrl: string) => void;
  agentPathPrefix: string;
  setAgentPathPrefix: (agentPathPrefix: string) => void;
  accessToken?: string;
  setAccessToken: (accessToken: string) => void;
  params?: Record<string, any>;
  tenant: Tenant;
  setSessionId: (threadId?: string) => void;
  adkAppName: string;
  setAdkAppName: (adkAppName: string) => void;
  messageParser?: (messages: Message[]) => void;
  setMessageParser: (messageParser: (messages: Message[]) => void) => void;
  openChat?: boolean;
  setOpenChat: (openChat: boolean) => void;
  setCurrentWorkbenchView: (id: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  firstUserInteraction?: string;
  setFirstUserInteraction: (firstUserInteraction: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  input?: string;
  setInput: (input: string) => void;
  handleHumanInput: (input: Content) => void;
  // handleRunTeam: (team: FlowTeamInput) => void;
  workflowRunId?: string;
  setWorkflowRunId: (workflowRunId: string) => void;
  chatStarted: boolean;
  setChatStarted: (chatStarted: boolean) => void;
  // messages: ChatMessage[];
  // setMessages: (messages: ChatMessage[]) => void;
  isDebug: boolean;
  setIsDebug: (isDebug: boolean) => void;
  openWorkbench?: boolean;
  setOpenWorkbench: (openWorkbench: boolean) => void;

  openRightPanel?: boolean;
  setOpenRightPanel: (openRightPanel: boolean) => void;

  //似乎没用了.
  activeArtiface: unknown;
  setActiveArtiface: (activeArtiface: unknown) => void;

  // assisantState
  assistantState: ChatAgentState;
  setAssistantState: (assistantState: ChatAgentState) => void;

  isOpenWorkbenchChat: boolean;
  setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  // addMessage: (message: ChatMessage) => void;
  setResourceId: (resourceId: string) => void;
  // setTeamState: (teamState: SocialTeamManagerState) => void;
  // loadChatMessageList: (response?: ChatMessageList) => void;
  workflowRunCreateMut: UseMutationResult<
    WorkflowRun,
    ApiErrors,
    Options<WorkflowRunCreateData>,
    unknown
  >;
  workflowRunCreate: (
    name: string,
    input: Record<string, any>,
    additionalMetadata: Record<string, any>,
  ) => Promise<WorkflowRun>;

  lastestWorkflowRun?: WorkflowRun;
  setLastestWorkflowRun: (lastestWorkflowRun: WorkflowRun) => void;

  // team: SocialTeam;
  // setTeam: (team: SocialTeam) => void;
  adkEvents: AdkEvent[];
  setAdkEvents: (adkEvents: AdkEvent[]) => void;

  agentState?: RootAgentState;
  setAgentState: (agentState: RootAgentState) => void;

  taskList: any[];
  setTaskList: (taskList: any[]) => void;

  onAgentMessageEvent: (message: MessageEvent<any>) => void;
}

export const createWorkbrenchSlice: StateCreator<WorkbrenchState, [], [], WorkbrenchState> = (
  set,
  get,
  init,
) => {
  return {
    userAgentState: {},
    setInput: (input) => set({ input }),
    messages: [],
    firstUserInteraction: undefined,
    setFirstUserInteraction: (firstUserInteraction) => set({ firstUserInteraction }),
    setAccessToken: (accessToken: string) => {
      set({ accessToken });
    },
    setParams: (params: Record<string, any>) => {
      set({ params });
    },
    agentPathPrefix: "api",
    setAgentPathPrefix: (agentPathPrefix: string) => {
      set({ agentPathPrefix });
    },
    setMessageParser: (messageParser: (messages: Message[]) => void) => {
      set({ messageParser });
    },
    openChat: false,
    setOpenChat: (openChat: boolean) => {
      set({ openChat });
    },
    openRightPanel: false,
    setOpenRightPanel: (openRightPanel: boolean) => {
      set({ openRightPanel });
    },
    isDebug: false,
    setIsDebug: (isDebug: boolean) => {
      set({ isDebug });
    },
    // team: exampleTeamConfig,
    // setTeam: (team) => {
    //   set({ team });
    // },
    agentState: undefined,
    setAgentState: (agentState) => {
      set({ agentState });
    },
    activeArtiface: undefined,
    setActiveArtiface: (activeArtiface) => {
      set({ activeArtiface });
    },
    adkAppName: DEFAULT_APP_NAME,
    setAdkAppName: (adkAppName) => {
      console.log("setAdkAppName", adkAppName);
      set({ adkAppName });
    },
    agentUrl: DEFAULT_AGENT_URL,
    setAgentUrl: (agentUrl) => {
      set({ agentUrl });
    },
    adkEvents: [],
    setAdkEvents: (adkEvents) => {
      set({ adkEvents });
    },
    taskList: [],
    setTaskList: (taskList) => {
      console.log("setTaskList", taskList);
      set({ taskList });
    },
    handleHumanInput: debounce(async (input: Content) => {
      // console.log("handleHumanInput", input);
      get().setChatStarted(true);
      const sessionId = get().sessionId ?? generateUUID();
      set({
        input: "",
        adkEvents: [
          ...get().adkEvents,
          {
            content: input,
            timestamp: new Date().toISOString(),
            metadata: {
              id: generateUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            app_name: get().adkAppName,
            // user_id: get().tenant.metadata.id,
            user_id: "fack_user_id",
            session_id: sessionId,
            author: "user",
            invocation_id: generateUUID(),
            actions: {},
            id: generateUUID(),
          },
        ],
      });
      const url = `${get().agentUrl}/api/chat_v2/sse`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "Accept-Encoding": "gzip, deflate, br, zstd",
        },
        body: JSON.stringify({
          session_id: sessionId,
          app_name: get().adkAppName,
          // user_id: get().tenant.metadata.id,
          user_id: "fack_user_id",
          new_message: input,
          streaming: true,
          init_state: {
            hello_init_state_from_web: "hello_init_state_from_web",
            ig_settings: data,
          },
        } satisfies AgentRunRequestV3),
      });
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }
      for await (const event of parseEventStream(reader)) {
        handleAgentOutgoingEvent(event, get, set);
      }
      // const data = await response.json();
      // console.log("data", data);

      // const response = await workflowRunCreate({
      //   path: {
      //     workflow: FlowNames.TEAM,
      //   },
      //   body: {
      //     input: {
      //       app_name: "root",
      //       component: get().team,
      //       session_id: sessionId,
      //       // init_state: {},
      //       task: {
      //         type: AgentEventType.TEXT_MESSAGE,
      //         content: task,
      //         source: "user",
      //         metadata: {},
      //       },
      //       content: input,
      //     } satisfies FlowTeamInput,
      //     additionalMetadata: {
      //       sessionId: sessionId,
      //     },
      //   },
      // });
      // if (response?.data) {
      //   get().setLastestWorkflowRun(response?.data);
      // }
      // if (response?.data) {
      //   // pull stream event
      //   if (response.data?.metadata?.id) {
      //     const workflowRunId = response.data.metadata?.id;
      //     set({ workflowRunId: workflowRunId });
      //     // const result = await get().dispatcherClient.subscribeToWorkflowEvents({
      //     //   workflowRunId: workflowRunId,
      //     // });
      //     // for await (const event of result) {
      //     //   handleWorkflowRunEvent(event, get, set);
      //     // }
      //   }
      // }
    }, 30),

    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    setSessionId: async (sessionId) => {
      // console.log("setSessionId", sessionId);
      set({ sessionId });
      if (!sessionId) {
        return;
      }
      // const adkSession = await adkSessionGet({
      //   path: {
      //     tenant: get().tenant.metadata.id,
      //     app: get().adkAppName,
      //     session: sessionId ?? "",
      //   },
      // });
      // console.log("adkStateQuery Result", adkSession);
      // if (adkSession.data) {
      //   set({ agentState: adkSession.data.state as RootAgentState });
      // }
    },
    setWorkflowRunId: (workflowRunId) => {
      set({ workflowRunId });
    },
    chatStarted: false,
    setChatStarted: (chatStarted: boolean) => {
      set({ chatStarted });
    },
    setOpenWorkbench: (openWorkbench: boolean) => {
      set({ openWorkbench });
    },
    setIsStreaming: (isStreaming: boolean) => {
      set({ isStreaming });
    },
    setFirstTokenReceived: (firstTokenReceived: boolean) => {
      set({ firstTokenReceived });
    },
    addMessage: (message: ChatMessage) => {
      const prevMessages = get().messages;
      set({ messages: [...prevMessages, message] });
    },
    setLastestWorkflowRun: (lastestWorkflowRun) => {
      console.log("setLastestWorkflowRun", lastestWorkflowRun);
      set({ lastestWorkflowRun });
    },
    loadChatMessageList: (chatMessageList) => {
      const messages = chatMessageList?.rows?.map((row) => {
        return {
          ...row,
          role: row.type,
          content: JSON.parse(row.content),
        };
      });
      set({ messages: messages });
    },
    workflowRunCreate: async (name, input, additionalMetadata) => {
      const response = await get().workflowRunCreateMut.mutateAsync({
        path: {
          workflow: name,
        },
        body: {
          input,
          additionalMetadata,
        },
      });
      return response;
    },
    setAssistantState: (assistantState) => {
      set({ assistantState });
    },
    onAgentMessageEvent: (message) => {
      console.log("onAgentMessageEvent", message);

      const parsedMessage = JSON.parse(message.data) as ChatAgentOutgoingMessage;
      const messageType = parsedMessage?.type;
      switch (messageType) {
        //@ts-expect-error
        case "cf_agent_chat_messages":
          // 对话消息
          break;
      }
      // set({ onAgentMessageEvent: message });
    },

    ...init,
  };
};

const createWordbrenchStore = (initProps?: Partial<WorkbrenchState>) => {
  return createStore<WorkbrenchState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "workbench-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<ReturnType<typeof createWordbrenchStore> | null>(null);

export const WorkbrenchProvider = (props: React.PropsWithChildren<WorkbenchProps>) => {
  const { children, ...etc } = props;
  const [isPending, startTransition] = useTransition();
  const tenant = useTenant();
  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
  });

  const tid = useTenantId();
  const mystore = useMemo(
    () =>
      createWordbrenchStore({
        ...etc,
        tenant: tenant,
        workflowRunCreateMut: workflowRunCreate,
      }),
    [tenant, workflowRunCreate],
  );

  // const agStateListQuery = useQuery({
  //   ...agStateListOptions({
  //     path: {
  //       tenant: tid!,
  //     },
  //     query: {
  //       session: etc.sessionId,
  //     },
  //   }),
  //   enabled: !!etc.sessionId,
  // });

  // useEffect(() => {
  //   if (agStateListQuery.data) {
  //     console.log("加载了:agStateListQuery.data", etc.sessionId, agStateListQuery.data);
  //     //TODO: 如何正确识别 UserAgentState?
  //     for (const state of agStateListQuery.data?.rows ?? []) {
  //       if (state.topic === "user") {
  //         mystore.setState({ userAgentState: state.state as UserAgentState });
  //       }
  //     }
  //   }
  // }, [agStateListQuery.data, mystore, etc.sessionId]);

  // useEffect(() => {
  //   return mystore.subscribe(
  //     (state) => {
  //       return state.lastestWorkflowRun;
  //     },
  //     async (cur, prev) => {
  //       console.log("lastestWorkflowRun changed", cur, "prev", prev);
  //       if (cur?.additionalMetadata?.sessionId) {
  //         startTransition(() => {
  //           nav({
  //             to: `/adk/session/${cur?.additionalMetadata?.sessionId}`,
  //             search: search,
  //           });
  //         });
  //         const sessionId = cur?.additionalMetadata?.sessionId;
  //         const messageList = await chatMessagesList({
  //           path: {
  //             tenant: tid!,
  //             chat: sessionId as string,
  //           },
  //         });
  //         mystore.getState().loadChatMessageList(messageList.data);
  //         console.log("messageList", messageList);
  //       }
  //     },
  //   );
  // }, [mystore, nav, search, tid]);

  // const adkEventsQuery = useQuery({
  //   ...adkEventsListOptions({
  //     path: {
  //       tenant: tid,
  //     },
  //     query: {
  //       session: etc.sessionId,
  //     },
  //   }),
  //   enabled: !!etc.sessionId,
  // });
  // useEffect(() => {
  //   if (adkEventsQuery.data) {
  //     mystore.setState({ adkEvents: adkEventsQuery.data.rows });
  //   }
  // }, [adkEventsQuery.data, mystore]);

  // const adkSessionQuery = useQuery({
  //   ...adkSessionGetOptions({
  //     path: {
  //       tenant: tid,
  //       session: etc.sessionId!,
  //     },
  //   }),
  //   enabled: !!etc.sessionId,
  // });
  // useEffect(() => {
  //   if (adkSessionQuery.data) {
  //     console.log("adkSessionQuery.data", adkSessionQuery.data);
  //     mystore.setState({ agentState: adkSessionQuery.data.state as RootAgentState });
  //   }
  // }, [adkSessionQuery.data, mystore]);

  useHotkeys(
    "alt+.",
    () => {
      mystore.setState({ isDebug: !mystore.getState().isDebug });
    },
    [mystore],
  );
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
      {/* <OnSessionChange /> */}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkbenchStore(): WorkbrenchState;
export function useWorkbenchStore<T>(selector: (state: WorkbrenchState) => T): T;
export function useWorkbenchStore<T>(selector?: (state: WorkbrenchState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useWorkbenchStore must in WorkbrenchProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}

// export const OnSessionChange = () => {
//   const sessionId = useWorkbenchStore((state) => state.sessionId);
//   const adkAppName = useWorkbenchStore((state) => state.adkAppName);
//   const setAdkEvents = useWorkbenchStore((state) => state.setAdkEvents);
//   const tid = useTenantId();
//   // const adkEventsQuery = useQuery({
//   //   ...adkEventsListOptions({
//   //     path: {
//   //       tenant: tid,
//   //     },
//   //     query: {
//   //       app_name: adkAppName,
//   //       session: sessionId!,
//   //     },
//   //   }),
//   // });

//   // useEffect(() => {
//   //   if (adkEventsQuery.data) {
//   //     console.log("adkEventsQuery.data", adkEventsQuery.data);
//   //     setAdkEvents(adkEventsQuery.data.rows || []);
//   //   }
//   // }, [adkEventsQuery.data, setAdkEvents]);
//   return null;
// };
