import { AsyncLocalStorage } from "node:async_hooks";
import { unstable_scheduleSchema } from "agents/schedule";
import { generateId, tool } from "ai";
import { z } from "zod";

import { getAgentByName } from "agents";
import type { Chat } from "./chat";
import type { WorkerAgent } from "./worker_agent";

export const agentContext = new AsyncLocalStorage<Chat>();

/**
 * Weather information tool that requires human confirmation
 * When invoked, this will present a confirmation dialog to the user
 * The actual implementation is in the executions object below
 */
const getWeatherInformation = tool({
  description: "show the weather in a given city to the user",
  parameters: z.object({ city: z.string() }),
  // Omitting execute function makes this tool require human confirmation
});

/**
 * Local time tool that executes automatically
 * Since it includes an execute function, it will run without user confirmation
 * This is suitable for low-risk operations that don't need oversight
 */
const getLocalTime = tool({
  description: "get the local time for a specified location",
  parameters: z.object({ location: z.string() }),
  execute: async ({ location }) => {
    console.log(`Getting local time for ${location}`);
    return "10am";
  },
});

const scheduleTask = tool({
  description: "A tool to schedule a task to be executed at a later time",
  parameters: unstable_scheduleSchema,
  execute: async ({ when, description }) => {
    // we can now read the agent context from the ALS store
    const agent = agentContext.getStore();
    if (!agent) {
      throw new Error("No agent found");
    }
    function throwError(msg: string): string {
      throw new Error(msg);
    }
    if (when.type === "no-schedule") {
      return "Not a valid schedule input";
    }
    const input =
      when.type === "scheduled"
        ? when.date // scheduled
        : when.type === "delayed"
          ? when.delayInSeconds // delayed
          : when.type === "cron"
            ? when.cron // cron
            : throwError("not a valid schedule input");
    try {
      agent.schedule(input!, "executeTask", description);
    } catch (error) {
      console.error("error scheduling task", error);
      return `Error scheduling task: ${error}`;
    }
    return `Task scheduled for type "${when.type}" : ${input}`;
  },
});

/**
 * Tool to list all scheduled tasks
 * This executes automatically without requiring human confirmation
 */
const getScheduledTasks = tool({
  description: "List all tasks that have been scheduled",
  parameters: z.object({}),
  execute: async () => {
    const agent = agentContext.getStore();
    if (!agent) {
      throw new Error("No agent found");
    }
    try {
      const tasks = agent.getSchedules();
      if (!tasks || tasks.length === 0) {
        return "No scheduled tasks found.";
      }
      return tasks;
    } catch (error) {
      console.error("Error listing scheduled tasks", error);
      return `Error listing scheduled tasks: ${error}`;
    }
  },
});

/**
 * Tool to cancel a scheduled task by its ID
 * This executes automatically without requiring human confirmation
 */
const cancelScheduledTask = tool({
  description: "Cancel a scheduled task using its ID",
  parameters: z.object({
    taskId: z.string().describe("The ID of the task to cancel"),
  }),
  execute: async ({ taskId }) => {
    const agent = agentContext.getStore();
    if (!agent) {
      throw new Error("No agent found");
    }
    try {
      await agent.cancelSchedule(taskId);
      return `Task ${taskId} has been successfully canceled.`;
    } catch (error) {
      console.error("Error canceling scheduled task", error);
      return `Error canceling task ${taskId}: ${error}`;
    }
  },
});

/**
 * Export all available tools
 * These will be provided to the AI model to describe available capabilities
 */
export const tools = {
  getWeatherInformation,
  getLocalTime,
  scheduleTask,
  getScheduledTasks,
  cancelScheduledTask,
  // callCoderAgent,
};

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 */
export const executions = {
  getWeatherInformation: async ({ city }: { city: string }) => {
    console.log(`Getting weather information for ${city}`);
    return `The weather in ${city} is sunny`;
  },
};

// 未起作用
export const callCoderAgentTool = tool({
  description: "调用具有 python 编程能力的Agent, 用来解决复杂问题",
  parameters: z.object({
    prompt: z.string().describe("The prompt to send to the coder agent"),
  }),
  execute: async ({ prompt }, options) => {
    try {
      // const result = await callAgentRunner(this.state.agentRunnerUrl, {
      //   app_name: "root",
      //   user_id: "user",
      //   session_id: sessionId,
      //   new_message: {
      //     role: "user",
      //     parts: [{ text: prompt }],
      //   },
      //   streaming: false,
      // });
      // console.log("callCoderAgent result", result);
    } catch (error) {
      //   console.error("Error calling coder agent", error);
      //   return `Error calling coder agent: ${error}`;
    }
  },
});

export const demoToolCheckState = tool({
  description: "检查当前状态",
  parameters: z.object({}),
  execute: async () => {
    return "当前状态检查完成";
  },
});

export const agentToolShortVideo = (chatAgent: Chat) => {
  return tool({
    description: "生成短视频",
    parameters: z.object({
      topic: z.string().describe("短视频主题"),
    }),
    execute: async ({ topic }) => {
      const state = await chatAgent.getState();

      // 更新chat 的状态
      const shortAgId = state.shortVideoAgentID;
      if (!shortAgId) {
        await chatAgent.setState({
          ...state,
          shortVideoAgentID: generateId(),
        });
      }

      // 调用短视频Agent
      const workerAgent = await getAgentByName<Env, WorkerAgent>(
        process.env.WorkerAgent!,
        "default",
      );

      //
      // if (!state.shortVideoAgentID) {
      //   throw new Error("短视频Agent未启动");
      // }
      return "短视频成功生成, 下载地址: https://www.baidu.com/my-short-video.mp4";
    },
  });
};
