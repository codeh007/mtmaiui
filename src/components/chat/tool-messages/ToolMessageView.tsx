"use client";

import type { MtLlmMessage } from "mtmaiapi";
export const FunctionExecutionResultMessageView = ({ msg }: { msg: MtLlmMessage }) => {
  const type = msg.type;
  if (type !== "FunctionExecutionResultMessage") {
    return (
      <div className="bg-red-100 p-1">unknown function execution result message type: {type}</div>
    );
  }

  // const content = msg.content[0];
  const llm_message = msg;
  if (llm_message.type === "FunctionExecutionResultMessage") {
    // const toolName = camelCase(llm_message.content);

    return (
      <div className="p-1 bg-amber-400 rounded-md">
        <pre>{JSON.stringify(llm_message, null, 2)}</pre>
        {/* {llm_message?.content?.map((item, i) => {
          const toolName = camelCase(item.name);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i}>
              <DebugValue data={{ msg }} />
              {toolName === "codeExecutor" ? (
                <CodeExecutorView msg={item} />
              ) : toolName === "socialLogin" ? (
                <SocialLoginView msg={item} />
              ) : (
                <div>unknown function result: {toolName}</div>
              )}
            </div>
          );
        })} */}
      </div>
    );
  }
};
