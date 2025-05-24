import type { Connection, Schedule } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import { type StreamTextOnFinishCallback, type ToolSet, tool } from "ai";
import type { Message } from "ai";
import { z } from "zod";
import { convertScheduleToScheduledItem } from "./utils";
export class ChatAgentBase<State = unknown> extends AIChatAgent<Env, State> {
  onMessage(connection: Connection, message: string): Promise<void> {
    return super.onMessage(connection, message);
  }
  async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
    const lastestMessage = this.messages?.[this.messages.length - 1];
    const userInput = lastestMessage?.content;
    this.log("userInput", userInput);
    if (userInput?.startsWith("/test/base")) {
      this.log("test/base");
      return;
    }
    return super.onChatMessage(onFinish);
  }

  log(...messages: unknown[]) {
    const message = messages.map((msg) => String(msg)).join(" ");
    this.broadcast(
      JSON.stringify({
        type: "log",
        data: {
          level: "info",
          message,
        },
      }),
    );
  }

  handleException(error: any) {
    console.error("handleException", error, error.stack);
    this.log(`(handleException): ${error}`);
    this.setState({
      ...this.state,
      error: error,
    });
  }

  notifySchedule(schedule: Schedule<unknown>, connection: Connection | undefined = undefined) {
    const message = JSON.stringify({
      type: "schedule",
      data: convertScheduleToScheduledItem(schedule),
    });
    if (connection) {
      connection.send(message);
    } else {
      this.broadcast(message);
    }
  }

  // 通过广播通知所有 参与者, 现在立即执行任务
  notifyRunSchedule(schedule: Schedule<string>) {
    const message = JSON.stringify({
      type: "runSchedule",
      data: convertScheduleToScheduledItem(schedule),
    });
    this.broadcast(message);
  }

  notifyError(error: unknown, connection: Connection | undefined = undefined) {
    const message = JSON.stringify({
      type: "error",
      data: error,
    });
    if (connection) {
      connection.send(message);
    } else {
      this.broadcast(message);
    }
  }

  // 演示, 直接调用另外一个 agent
  // async demoCallAgent() {
  //   const workerAgent = await getAgentByName<Env, WorkerAgent>(this.env.WorkerAgent, "default");
  //   // const id = this.env.WorkerAgent.idFromName("default");
  //   // const workerAgent = this.env.WorkerAgent.get(id);

  //   if (!workerAgent) {
  //     // throw new Error("Worker agent not found");
  //     this.handleException(new Error("Worker agent not found"));
  //   }
  //   workerAgent.log("log message from worker agent");
  //   await workerAgent.callAdkAgent("shortvideo_agent", {
  //     role: "user",
  //     parts: [
  //       {
  //         type: "text",
  //         text: "call adk agent example",
  //       },
  //     ],
  //   });
  // }

  //=========================================================================================================
  // 发送消息到 MQ
  //=========================================================================================================
  async tool_pushTask(taskType: string, payload: any) {
    // const res = await fetch(`${getAppConfig().apiEndpoint}/api/mq/${taskType}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // });
    // return res.json();
  }

  toolSmolagent() {
    return {
      smolagent: tool({
        description: "运行 python 代码,解决复杂问题的agent",
        parameters: z.object({
          task: z.string().describe(`任务描述,例子1:如何生成一个短视频,
          例子2: 289.882乘以180.34减去3098.120, 结果保留两位小数,最终结果是多少?
          `),
        }),
        execute: async ({ task }) => {
          // const res = await fetch(`${getAppConfig().apiEndpoint}/api/mq/smalagent`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     task_type: "smolagent",
          //     input: task,
          //   }),
          // });
          // return res.json();
        },
      }),
    };
  }

  async onCallAdk(newMessage: Message) {
    const adkEndpoint = "http://localhost:7860/run_sse_v2";
    const postData = {
      app_name: "root",
      user_id: "user",
      session_id: "a16c95ef-eb45-496d-9c88-f95406f12e3b---",
      new_message: {
        role: newMessage.role,
        parts: [
          {
            text: newMessage.content,
          },
        ],
      },
      streaming: false,
    };

    const response = await fetch(adkEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get reader from response body");
    }

    async function* streamAdkMessages() {
      try {
        let buffer = "";
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          buffer += text;

          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

          for (const line of lines) {
            if (line.trim() === "") continue;
            if (line === "data: [DONE]") {
              console.log("Adk SSE message: [DONE]");
              return;
            }

            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);
                yield data;
              } catch (e) {
                console.error("(Adk sse) Failed to parse SSE message:", line);
                // console.error("Parse error:", e);
              }
            }
          }
        }
      } finally {
        reader?.releaseLock();
      }
    }
    return streamAdkMessages();
  }
}
