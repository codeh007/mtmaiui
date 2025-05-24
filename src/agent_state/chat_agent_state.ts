import type { AgentStateBase, LogMessage, MessageRunSchedule, ScheduleMessage } from "./shared";

export interface ChatAgentState extends AgentStateBase {}

export type ChatAgentIncomingMessage = new_chat_participant | ScheduleMessage;

interface new_chat_participant {
  type: "new_chat_participant";
  data: {
    agentName: string;
  };
}

export type ChatAgentOutgoingMessage =
  | NewChatParticipantMessage
  | LogMessage
  | MessageRunSchedule
  | ScheduleMessage;

export type NewChatParticipantMessage = {
  type: "new_chat_participant";
  data: {
    agentName: string;
  };
};
