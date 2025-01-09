import type { LangChainMessage } from "@assistant-ui/react-langgraph";
import { Client, type ThreadState } from "@langchain/langgraph-sdk";

const createClient = () => {
  const apiUrl =
    //@ts-ignore
    process.env.NEXT_PUBLIC_LANGGRAPH_API_URL ||
    new URL("/api", window.location.href).href;
  return new Client({
    apiUrl,
  });
};

export const createAssistant = async (graphId: string) => {
  const client = createClient();
  return client.assistants.create({ graphId });
};

export const createThread = async () => {
  const client = createClient();
  return client.threads.create();
};

export const getThreadState = async (
  threadId: string,
): Promise<ThreadState<Record<string, any>>> => {
  const client = createClient();
  return client.threads.getState(threadId);
};

export const updateState = async (
  threadId: string,
  fields: {
    newState: Record<string, any>;
    asNode?: string;
  },
) => {
  const client = createClient();
  return client.threads.updateState(threadId, {
    values: fields.newState,
    //@ts-ignore
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    asNode: fields.asNode!,
  });
};

export const sendMessage = async (params: {
  threadId: string;
  messages: LangChainMessage[];
}) => {
  const client = createClient();

  const input: Record<string, any> | null = {
    messages: params.messages,
  };
  const config = {
    configurable: {
      model_name: "openai",
    },
  };

  return client.runs.stream(
    params.threadId,
    //@ts-ignore
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
    {
      input,
      config,
      streamMode: "messages",
    },
  );
};
