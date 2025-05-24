import type { Session } from "@auth/core/types";

// Approval string to be shared across frontend and backend
export const APPROVAL = {
  YES: "Yes, confirmed.",
  NO: "No, denied.",
} as const;

export const AgentNames = {
  shortVideoAg: "short-video-ag",
} as const;

export interface AgentStateBase {
  lastUpdated?: number;
  error?: string;
  enabledDebug?: boolean;
  // 子 agent, 让前端可以判断和显示子 agent 视图
  subAgents?: Record<string, string>;
  // 是否自动调度
  enabledAutoDispatch?: boolean;
  runningTasks: Record<string, any>;
  counter: number;
}

export type McpServer = {
  url: string;
  state: "authenticating" | "connecting" | "ready" | "discovering" | "failed";
  authUrl?: string;
};
export type ScheduledItem = {
  id: string;
  type: "cron" | "scheduled" | "delayed";
  trigger: string;
  nextTrigger: string;
  description: string;
};

export type IncomingMessage =
  | {
      type: "schedule";
      input: string;
    }
  | {
      type: "delete-schedule";
      id: string;
    }
  | {
      type: "demo-event-1";
      data: unknown;
    }
  | {
      type: "add-mcp-server";
      data: McpServer;
    }
  | {
      type: "remove-mcp-server";
      id: string;
    }
  | {
      type: "set-mcp-server";
      data: McpServer;
    }
  | {
      type: "set-user-session";
      data: Session;
    }
  | {
      // 调用 python 版 adk
      type: "call-adk";
      data: unknown;
    }
  | {
      type: "demo_run_2";
      data: unknown;
    };

export type OutgoingMessage =
  | {
      type: "connected";
      data: unknown;
    }
  | {
      type: "schedules";
      data: ScheduledItem[];
    }
  | {
      type: "error";
      data: string;
    }
  | ScheduleMessage
  | {
      type: "demo-event-response";
      data: unknown;
    }
  | {
      type: "require-main-access-token";
      data: unknown;
    }
  | {
      type: "toast";
      data: {
        message: string;
      };
    }
  | {
      type: "new-step";
      data: unknown;
    }
  | MessageRunSchedule
  | LogMessage;

export type MessageRunSchedule = {
  type: "runSchedule";
  data: ScheduledItem;
};

export type ScheduleMessage = {
  type: "schedule";
  data: ScheduledItem;
};

export type LogMessage = {
  type: "log";
  data: {
    level?: "debug" | "info" | "warn" | "error";
    message: string;
  };
};
