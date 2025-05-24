import type {
  AgentStateBase,
  LogMessage,
  MessageRunSchedule,
  ScheduleMessage,
} from "../../agent_state/shared";

export interface ShortVideoAgentState extends AgentStateBase {
  // 其他相关 api 端点
  mtmai_api_endpoint: string;
  // 短视频生成相关
  video_subject?: string;
  video_script?: string;
  speechUrl?: string;
  // mainSence: z.infer<typeof MainSenceSchema>;
  // 字幕
  srt?: string;
  // 视频元数据
  videoMeta: {
    fps: number;
    width: number;
    height: number;
  };
}

export type ShortVideoInMessage = ShortVideoTopicMessage | ShortVideoRunWorkflowMessage;

export type ShortVideoTopicMessage = {
  type: "shortvideo_topic";
  data: {
    topic: string;
  };
};

export type ShortVideoRunWorkflowMessage = {
  type: "run_workflow_shortvideo";
  data: {
    topic: string;
  };
};

export type ShortVideoOutMessage = LogMessage | MessageRunSchedule | ScheduleMessage;
