export interface MtEventMessage {
  type: string;
  payload: any;
}

export interface AgTextMessage {
  source: string;
  content: string;
  type: string;
}
