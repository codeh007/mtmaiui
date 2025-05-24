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
    // 处理 functionCall 到 function_call 的转换
    for (const part of event.content?.parts ?? []) {
      //@ts-expect-error
      if (part.functionCall) {
        //@ts-expect-error
        part.function_call = part.functionCall;
      }
    }
    // console.log({ event, adkEvents: get().adkEvents });

    if (event.partial) {
      // 查找是否已存在相同 invocation_id 的事件
      const existingEvent = get().adkEvents.find(
        (item) => item.invocation_id === event.invocation_id,
      );

      if (event.partial) {
        // 流式响应处理
        if (!existingEvent) {
          // 首次收到流式响应，创建新事件
          addAdkRawEvent(event, get, set);
        } else {
          // 更新已有事件的内容
          set({
            adkEvents: get().adkEvents.map((item) => {
              if (item.invocation_id === event.invocation_id) {
                const newText =
                  (item.content?.parts?.[0]?.text || "") + (event.content?.parts?.[0]?.text || "");
                return {
                  ...item,
                  content: {
                    ...event.content,
                    role: event.content?.role,
                    parts: [{ text: newText }],
                  },
                };
              }
              return item;
            }),
          });
        }
      } else {
        // 非流式完整消息处理
        if (!existingEvent) {
          // 只有不存在相同 invocation_id 的消息时才添加
          addAdkRawEvent(event, get, set);
        } else {
          // 如果存在则更新为完整消息
          set({
            adkEvents: get().adkEvents.map((item) => {
              if (item.invocation_id === event.invocation_id) {
                return {
                  ...item,
                  content: event.content!,
                };
              }
              return item;
            }),
          });
        }
      }
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
