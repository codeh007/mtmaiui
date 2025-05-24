"use client";

import type { AdkRawEvent } from "mtmaiapi";
import { generateUUID } from "mtxuilib/lib/utils";
import type { WorkbrenchState } from "./workbrench.store";

export const handleAgentOutgoingEvent = (
  event: AdkRawEvent,
  get: () => WorkbrenchState,
  set: (
    partial: Partial<WorkbrenchState> | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
) => {
  if (event.content) {
    for (const part of event.content.parts) {
      //@ts-expect-error
      if (part.functionCall) {
        //@ts-expect-error
        part.function_call = part.functionCall;
      }
    }
    if (event.partial) {
      const adkEvent = get().adkEvents.find((item) => item.invocation_id === event.invocation_id);
      if (!adkEvent) {
        addAdkRawEvent(event, get, set);
      } else {
        // 流式事件处理: 更新现有事件的内容，合并之前的消息内容
        set({
          adkEvents: get().adkEvents.map((item) => {
            const newText =
              (item.content?.parts?.[0]?.text || "") + event.content?.parts?.[0]?.text;
            console.log("newText", newText);
            if (item.invocation_id === event.invocation_id) {
              return {
                ...item,
                content: {
                  ...event.content,
                  role: event.content!.role,
                  parts: [
                    {
                      text: newText,
                    },
                  ],
                },
              };
            }
            return item;
          }),
        });
      }
    } else {
      // 完整消息
      // const adkEvent = get().adkEvents.find((item) => item.invocation_id === event.invocation_id);
      // if (adkEvent) {
      //   // 更新为完整消息
      //   set({
      //     adkEvents: get().adkEvents.map((item) => {
      //       if (item.invocation_id === event.invocation_id) {
      //         return {
      //           ...item,
      //           ...(event.content && { content: event.content }),
      //         };
      //       }
      //       return item;
      //     }),
      //   });
      // } else {
      //   // 添加新的完整消息
      addAdkRawEvent(event, get, set);
      // }
    }
  }
};

const addAdkRawEvent = (
  event: AdkRawEvent,
  get: () => WorkbrenchState,
  set: (
    partial: Partial<WorkbrenchState> | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
) => {
  set({
    adkEvents: [
      ...get().adkEvents,
      {
        //TODO: 细节需要修正
        metadata: {
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        content: event.content!,
        app_name: "root",
        user_id: get().tenant.metadata.id,
        session_id: get().sessionId ?? "",
        author: event.author,
        invocation_id: event.invocation_id,
        actions: event.actions,
        id: generateUUID(),
        timestamp: new Date().toISOString(),
      },
    ],
  });
};
