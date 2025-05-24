export type WorkerAgentState = {
  totalWorkers: number;
  lastUpdated: number;
  error?: string;
};

export type WorkerAgentOutgoingMessage = {
  type: "new_worker_connected";
  data: {
    workerId: string;
  };
};
