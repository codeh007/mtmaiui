"use client";

import { v4 as uuidv4 } from "uuid";
import { eventHandler } from "./eventHandler";
import type { WorkbrenchState } from "./workbrench.store";

export const handleSseSubmit = async (
  set: (
    partial:
      | Partial<WorkbrenchState>
      | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
  get: () => WorkbrenchState,
) => {
  const { backendUrl, tenant, params } = get();
  const endpoint = `${backendUrl}/api/v1/tenants/${tenant.metadata.id}/chat`;
  const messageToSend = get().messages.map((message) => ({
    role: message.name,
    content: message.output,
  }));

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${get().accessToken}`,
    },
    //允许跨站cookie，这样可以不用专门设置 Authorization header
    credentials: "include",
    body: JSON.stringify({
      messages: messageToSend,
      profile: get().chatProfile,
      threadId: get().threadId,
      params: params,
    }),
  });

  const geOrCreatetLastAssisantStep = () => {
    const messages = get().messages;
    const latestStep = messages[messages.length - 1];
    let latestAssistantStep: IStep | null = null;
    if (latestStep.type === "assistant_message") {
      latestAssistantStep = latestStep;
    } else {
      const newStep: IStep = {
        threadId: "",
        id: uuidv4(),
        name: "Assisant",
        type: "assistant_message",
        output: "",

        createdAt: new Date().toISOString(),
      };
      latestAssistantStep = newStep;
      get().setMessages([...get().messages, newStep]);
    }
    return latestAssistantStep;
  };

  const streamToken = (token: string) => {
    console.log(token);
    const latestAssistantStep = geOrCreatetLastAssisantStep();
    try {
      const preMessages = get().messages;
      // const newMessage = updateMessageContentById(
      //   preMessages,
      //   latestAssistantStep.id,
      //   token,
      //   false, //isSequence,
      //   false, //isInput,
      // );
      // get().setMessages(newMessage);
    } catch (e) {
      console.log("stream token 出错", e);
    }
  };

  if (response.ok) {
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
            try {
              if (line.startsWith("0:")) {
                const content = line.substring(2);
                const con = JSON.parse(content);
                streamToken(con);
              } else if (line.startsWith("2:")) {
                // data part
                const datas = JSON.parse(line.replace("2:", "").trim());
                // console.log("Received datas:", datas);
                eventHandler(datas, set, get);
              } else if (line.startsWith("d:")) {
                //Finish Message Part
                const datas = JSON.parse(line.replace("d:", "").trim());
                console.log("Received finished event:", datas);
              } else {
                console.debug("unknown event:", line);
              }
            } catch (error) {
              console.error("handle event:", { error, line });
            }
          }
        }
      }
    }
  }
};
