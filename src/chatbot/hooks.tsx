"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompletion } from "ai/react";
import { randomString } from "mtxuilib/lib/utils";
import { useCallback, useEffect, useState } from "react";
const uimessagesItemsIdKey = "agentMessages";

export const useThreadId = () => {
  const qc = useQueryClient();
  const threadId = qc.getQueryData(["threadId"]);
  return threadId as string;
};

export const useAgentName = () => {
  const qc = useQueryClient();
  const agent = qc.getQueryData(["agent"]);
  return agent as string;
};

export const useAgentEndpoint = () => {
  const data = useBaseUrl();
  return `${data}/api/v1/chat/completions`;
};

export const useAppendUiMessages = () => {
  const qc = useQueryClient();
  const fn = useCallback(
    (items: ChatMessagesItem[]) => {
      // console.log("useAppendUiMessages called", items);
      if (items?.length === 0) {
        return;
      }

      const key = [{ _id: uimessagesItemsIdKey }];
      qc.setQueriesData(
        {
          queryKey: key,
        },
        (pre: AgentMessagesResponse | undefined) => {
          return {
            count: (pre?.count || 0) + 1,
            data: [...(pre?.data || []), ...items],
          };
        },
      );
    },
    [qc],
  );
  return fn;
};

export const useBaseUrl = () => {
  return "todo base url ";
};
export const useHandlerStreamData = () => {
  const chatId = useLocalChatId();
  const qc = useQueryClient();
  const baseUrl = useBaseUrl();

  const appendUiMessages = useAppendUiMessages();

  const setChatId = useSetLocalChatId();

  const fn = useCallback(
    (data) => {
      data?.map((item, i) => {
        if (!item) {
          return;
        }
        if (item?.ui_messages?.length) {
          console.log("stream items:", item);
          appendUiMessages(item?.ui_messages);
        }
        const newChatId = item?.chat_id;
        console.log("newChatId", newChatId, "prechatid", chatId);
        if (!chatId && newChatId) {
          setChatId(newChatId);
          // 将没 threadId 的消息列表，复制到 带 threadId 的query result 中。
          // 原因在于 thread 是在用户发送第一条信息后由后端完成第一个 comppletion 后返回到前端的。
          // 当获取到threadId 后，同时改写浏览器url。
          // 为了不中断UI，这里需要对消息进行复制。
          const oldKey = [
            {
              _id: uimessagesItemsIdKey,
              baseUrl,
              body: {
                chat_id: chatId || "",
              },
            },
          ];
          const cachedDatas = qc.getQueriesData({
            queryKey: oldKey,
          });
          if (!cachedDatas || cachedDatas.length === 0) {
            console.log("cachedDatas is empty for key:", oldKey);
            // throw new Error(
            // 	`cachedDatas is empty: ${JSON.stringify(oldKey, null, 2)}`,
            // );
            return;
          }

          const agentMessagesResponse =
            cachedDatas[0][1] as AgentMessagesResponse;
          console.log("旧的消息列表", agentMessagesResponse);
          const newKey = [
            {
              _id: uimessagesItemsIdKey,
              baseUrl,
              body: {
                chat_id: newChatId,
              },
            },
          ];
          qc.removeQueries({ queryKey: oldKey });
          console.log("消息复制结果", {
            agentMessagesResponse,
            oldKey,
            newKey,
          });
          qc.setQueryData(newKey, agentMessagesResponse);
        }
      });
    },
    [chatId, qc, baseUrl, appendUiMessages, setChatId],
  );
  return fn;
};

interface UseCompletionInputProps {
  threadId?: string;
  isNew?: boolean;
}
export const useCompletionInput = (props?: UseCompletionInputProps) => {
  const agentEndpoint = useAgentEndpoint();
  const chatId = useLocalChatId();
  const handlerStreamData = useHandlerStreamData();

  const [artifacts, setArtifacts] = useState([]);
  const completion = useCompletion({
    api: agentEndpoint,
    body: {
      isChat: true,
      chatId: chatId,
      stream: true,
      model: "storm",
    },
    onResponse(response) {
      // console.log("on response", response)
    },
    onFinish(prompt) {
      // console.log("on ?Finish", completion);
      // handlerStreamData(completion?.data);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (completion.data) {
      // 确保仅执行一次
      console.log("handlerStreamData", completion);
      handlerStreamData(completion?.data);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      completion?.data?.map((item: any, i) => {
        if (item?.artifacts?.length) {
          setArtifacts(item.artifacts);
        }
      });
    }
  }, [completion.data]);

  const fn = useCallback(
    (userInput: string) => {
      completion.complete(userInput);
    },
    [completion],
  );

  return {
    submitText: fn,
    completion: completion.completion,
    artifacts,
  };
};

export const useMakeNewChat = () => {
  const qc = useQueryClient();
  const fn = useCallback(() => {
    qc.removeQueries({ queryKey: [{ _id: uimessagesItemsIdKey }] });
  }, [qc]);
  return fn;
};

export const useSubmitUserInputText = () => {
  const chatId = useLocalChatId();
  const appendUiMessages = useAppendUiMessages();
  const fn = useCallback(
    async (text: string) => {
      console.log("chatId", chatId, "text", text);

      appendUiMessages([
        {
          id: randomString(10),
          role: "user",
          content: text,
          component: "UserMessage",
          props: {
            content: text,
          },
        },
        {
          role: "assistant",
          id: randomString(10),
          // content: text,

          component: "AiCompletion",
          props: {
            userInput: text,
          },
        },
      ]);
    },
    [chatId, appendUiMessages],
  );

  return fn;
};

// export const useUiMessages = () => {
//   const chatId = useLocalChatId();
//   const qc = useQueryClient();
//   const originQueryOptions = agentMessagesOptions({
//     body: {
//       // thread_id: threadId || "",
//       chat_id: chatId || "",
//     },
//     // path: {
//     // 	chat_id: chatId || "",
//     // },
//   });
//   const query = useSuspenseQuery({
//     ...originQueryOptions,
//     // enabled: !!chatId,
//     initialData: {
//       count: 0,
//       data: [],
//     },
//   });
//   // useMemo(() => {
//   // 	if (searchParams.get("threadId") !== preThreadId) {
//   // 		// console.log("invalidateQueries", originQueryOptions.queryKey);
//   // 		// qc.invalidateQueries({ queryKey: originQueryOptions.queryKey });
//   // 	}
//   // }, [preThreadId, searchParams]);

//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
//   // useEffect(() => {
//   // 	//页面初始加载，如果有 threadId 参数，则加载消息列表
//   // 	if (threadId) {
//   // 		qc.invalidateQueries({ queryKey: originQueryOptions.queryKey });
//   // 	}
//   // }, []);
//   // return query;
//   // [];
//   // query.data
//   return query;
// };

// export const useAgentBootstrap = () => {
//   const agentAgentBootstrapQuery = useQuery({
//     ...agentAgentBootstrapOptions(),
//   });

//   return agentAgentBootstrapQuery;
// };

export const useLocalChatId = () => {
  const query = useQuery({
    queryKey: ["localChatId"],
    queryFn: () => {
      return localStorage.getItem("chatId") || "";
    },
    initialData: "",
  });
  return query.data;
};
export const useSetLocalChatId = () => {
  const qc = useQueryClient();
  const fn = useCallback(
    (chatId: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("chatId", chatId);
        qc.setQueryData(["localChatId"], chatId);
      }
    },
    [qc],
  );
  return fn;
};
