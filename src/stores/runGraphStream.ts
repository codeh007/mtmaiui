"use client";

import { generateId } from "ai";
import type { AgentNodeRunRequest } from "mtmaiapi";
import type { AgentNodeState } from "./GraphContextV2";

export async function runGraphStream(
  { ...props }: AgentNodeRunRequest,
  set: (
    partial:
      | Partial<AgentNodeState>
      | ((state: AgentNodeState) => Partial<AgentNodeState>),
  ) => void,
  get: () => AgentNodeState,
) {
  try {
    console.log("runGraphStream", props);
    /**
     * 由于 大语言 应用 本质上就是 基于事件工作流
     * 这里有两个方式来处理
     * 1: 节点间的跳转由前端完成
     * 2: 节点间的跳转由后端完成
     *
     * 目前先实现第一点
     */
    const backendUrl = get().backendUrl;
    const tenant = get().tenant;
    if (!tenant?.metadata?.id) {
      throw new Error("(runGraphStream)tenant is required");
    }
    const endpointUrl = `${backendUrl}/api/v1/tenants/${tenant.metadata.id}/nodes/run`;
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...props, isStream: true }),
      credentials: "include",
    });
    // stream 流式处理
    if (response) {
      const reader = response.body?.getReader();
      let buffer = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = new TextDecoder().decode(value).split("\n");
          buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

          // # 使用  vercel ai sdk 的协议格式
          for (const line of lines) {
            if (line.trim() !== "") {
              // console.log("lines", line);
              try {
                if (line.startsWith("0:")) {
                  const content = line.substring(2);
                  const con = JSON.parse(content);
                  let lastMessage = get().messages[get().messages.length - 1];
                  console.log("lastMessage", lastMessage);
                  if (lastMessage.role === "user") {
                    const newAssistantMessage = {
                      role: "assistant",
                      content: con,
                      id: generateId(),
                      createdAt: new Date(),
                      threadId: get().runId,
                    };
                    set({ messages: [...get().messages, newAssistantMessage] });
                  }
                  lastMessage = get().messages[get().messages.length - 1];
                  if (lastMessage?.role === "assistant") {
                    console.log("lastMessage(assistant)", lastMessage);
                    lastMessage.content = lastMessage.content.concat(con);

                    const messagesWithoutLast = get().messages.slice(0, -1);
                    set({
                      messages: [...messagesWithoutLast, lastMessage],
                    });
                  }
                } else if (line.startsWith("2:")) {
                  // data part
                  const datas = JSON.parse(line.replace("2:", "").trim());

                  // eventHandler(datas, set, get);
                } else if (line.startsWith("d:")) {
                  //Finish Message Part
                  const datas = JSON.parse(line.replace("d:", "").trim());
                  console.log("Received finished event:", datas);
                } else {
                  console.log("unknown event:", line);
                  try {
                    const chunk = JSON.parse(line);
                    // yield { data: chunk };
                  } catch (e) {}
                }
              } catch (error) {
                console.error("handle event:", { error, line });
              }
            }
          }
        }
      }
    }
    // json data response
    // TODO: 这里需要处理 大语言 应用 的 返回数据
  } catch (e) {
    console.error(e);
  }
}
