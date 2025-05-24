"use client";

import type { Sandbox } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { sendSsePostRequest } from "mtxuilib/llm/sse";
import { Button } from "mtxuilib/ui/button";
import { useCallback } from "react";
export const SandBoxViewAdk = ({ sandbox }: { sandbox: Sandbox }) => {
  const runSseUrl = `${sandbox.url}/run_sse`;

  const examplePostData = {
    appName: "image2shorts_agent",
    userId: "user",
    sessionId: "fee33ab9-66a2-4937-9794-28d38f3b3c43",
    newMessage: {
      role: "user",
      parts: [
        {
          text: "nihao ",
        },
      ],
    },
    streaming: false,
  };

  const handleSseEvent = useCallback((event: string) => {
    if (typeof event === "string") {
      console.log("SSE Message:", JSON.parse(event));
    }
    if (typeof event === "object") {
      console.log("SSE Message2:", event);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-blue-200 rounded-md p-4">
      <div>
        <div>
          <div>SandBoxViewAdk</div>
          <DebugValue data={sandbox} />
          <Button
            onClick={async () => {
              const stream = sendSsePostRequest(runSseUrl, examplePostData);
              for await (const event of stream) {
                if (event.startsWith("data: ")) {
                  const data = event.split("data: ")[1];
                  handleSseEvent(data);
                } else {
                  console.log("收到sse 未知事件:", event);
                }
              }
            }}
          >
            Run sse
          </Button>
        </div>
      </div>
    </div>
  );
};
