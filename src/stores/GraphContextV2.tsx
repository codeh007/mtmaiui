"use client";
import { generateId } from "ai";
import type {
  AgentNode,
  AgentNodeRunRequest,
  ChatMessage,
  Tenant,
} from "mtmaiapi";
import type { ArtifactV3, TextHighlight } from "mtxuilib/types";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { runGraphStream } from "./runGraphStream";

// console.log("loaded GraphContextV2");
// interface GraphData {
//   runId: string | undefined;
//   isStreaming: boolean;
//   selectedBlocks: TextHighlight | undefined;
//   artifact: ArtifactV3 | undefined;
//   updateRenderedArtifactRequired: boolean;
//   isArtifactSaved: boolean;
//   firstTokenReceived: boolean;
//   feedbackSubmitted: boolean;
//   setFeedbackSubmitted: Dispatch<SetStateAction<boolean>>;
//   // setArtifact: Dispatch<SetStateAction<ArtifactV3 | undefined>>;
//   // setSelectedBlocks: Dispatch<SetStateAction<TextHighlight | undefined>>;
//   // setSelectedArtifact: (index: number) => void;
//   // streamMessage: (params: GraphInput) => Promise<void>;
//   setArtifactContent: (index: number, content: string) => void;
//   clearState: () => void;
//   setUpdateRenderedArtifactRequired: Dispatch<SetStateAction<boolean>>;
// }

// type ThreadDataContextType = ReturnType<typeof useThread>;

// type AssistantsDataContextType = ReturnType<typeof useAssistants>;

// type GraphContentType = {
//   graphData: GraphData;
//   threadData: ThreadDataContextType;
//   assistantsData: AssistantsDataContextType;
// };

// const GraphContext = createContext<GraphContentType | undefined>(undefined);

// export interface GraphInput {
//   // messages?: Record<string, any>[];

//   backendUrl?: string;
//   tenantId: string;
//   payload: any;
//   highlightedCode?: CodeHighlight;
//   highlightedText?: TextHighlight;

//   artifact?: ArtifactV3;

//   language?: LanguageOptions;
//   artifactLength?: ArtifactLengthOptions;
//   regenerateWithEmojis?: boolean;
//   readingLevel?: ReadingLevelOptions;
//   customQuickActionId?: string;
// }

export interface AgentNodeProps {
  backendUrl: string;
  // tenantId: string;
  tenant: Tenant;
}
export interface AgentNodeState extends AgentNodeProps {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  agentNode: AgentNode;
  setAgentNode: (agentNode: AgentNode) => void;

  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;

  addMessage: (message: ChatMessage) => void;
  submitHumanInput: (content: string) => void;
  modelName: string;
  setModelName: (modelName: string) => void;

  selectedAssistant: string;
  setSelectedAssistant: (selectedAssistant: string) => void;

  feedbackSubmitted: boolean;
  setFeedbackSubmitted: (feedbackSubmitted: boolean) => void;

  runId: string;
  setRunId: (runId: string) => void;

  //可能放这里不合适
  artifact: ArtifactV3 | undefined;
  setArtifact: (artifact: ArtifactV3) => void;
  isArtifactSaved: boolean;
  setIsArtifactSaved: (isArtifactSaved: boolean) => void;
  selectedArtifact: number;
  setSelectedArtifact: (index: number) => void;
  //可能放这里不合适
  selectedBlocks: TextHighlight | undefined;
  setSelectedBlocks: (selectedBlocks: TextHighlight) => void;
  streamMessage: (params: AgentNodeRunRequest) => Promise<void>;
}
export const createGraphSlice: StateCreator<
  AgentNodeState,
  [],
  [],
  AgentNodeState
> = (set, get, init) => {
  return {
    nodeState: undefined,
    messages: [],
    setMessages: (messages: ChatMessage[]) => {
      set({ messages });
    },
    setAgentNode: (agentNode: AgentNode) => {
      set({ agentNode });
    },
    setIsStreaming: (isStreaming: boolean) => {
      set({ isStreaming });
    },
    setFirstTokenReceived: (firstTokenReceived: boolean) => {
      set({ firstTokenReceived });
    },
    setSelectedAssistant: (selectedAssistant: string) => {
      set({ selectedAssistant });
    },
    setRunId: (runId: string) => {
      set({ runId });
    },
    setArtifact: (artifact: ArtifactV3) => {
      set({ artifact });
    },
    setSelectedBlocks: (selectedBlocks: TextHighlight) => {
      set({ selectedBlocks });
    },
    setIsArtifactSaved: (isArtifactSaved: boolean) => {
      set({ isArtifactSaved });
    },
    setSelectedArtifact: (index: number) => {
      set({ selectedArtifact: index });
    },
    streamMessage: (params) => {
      return runGraphStream({ ...params }, set, get);
    },
    addMessage: (message: ChatMessage) => {
      const prevMessages = get().messages;
      set({ messages: [...prevMessages, message] });
    },
    submitHumanInput: async (content: string) => {
      const prevMessages = get().messages;
      const humanMessage = {
        role: "user",
        content,
        id: generateId(),
        createdAt: new Date(),
        threadId: get().runId,
      };
      set({ messages: [...prevMessages, humanMessage] });

      await runGraphStream({}, set, get);
    },
    ...init,
  };
};

type mtappStore = ReturnType<typeof createWordbrenchStore>;
type GraphV2StoreState = AgentNodeState;

const createWordbrenchStore = (initProps?: Partial<GraphV2StoreState>) => {
  return createStore<GraphV2StoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createGraphSlice(...a),
          ...initProps,
        })),
        {
          name: "graph-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<AgentNodeProps>;
export const GraphV3Provider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  const mystore = useMemo(() => createWordbrenchStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useGraphStore(): GraphV2StoreState;
export function useGraphStore<T>(selector: (state: GraphV2StoreState) => T): T;
export function useGraphStore<T>(selector?: (state: GraphV2StoreState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useGraphStore must in GraphV3Provider");
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
