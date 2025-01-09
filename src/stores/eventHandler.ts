"use client";

import type { WorkbrenchState } from "./workbrench.store";

export const subscribeSse = (
  options: {
    runId: string;
  },
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
  get: () => WorkbrenchState,
) => {
  const { runId } = options;
};

export const eventHandler = async (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  event: Record<string, any>,
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
  get: () => WorkbrenchState,
) => {
  const eventType = event.type;
  switch (eventType) {
    case "chatNodeRunId": {
      // new thread
      const newThreadId = event.data as string;
      console.log("new thread:", newThreadId);
      window.history.replaceState({}, "", `/dash/chat/${newThreadId}`);
      set({ threadId: newThreadId });
      break;
    }
    default:
      console.debug("unknown event:", eventType);
      break;
  }
};
