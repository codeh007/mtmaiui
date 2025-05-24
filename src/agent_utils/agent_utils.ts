// import type { AgentRunRequest } from "../agent_state/root_agent_state";

// import type { AgentRunRequest } from "mtmaiapi";

// export async function callAgentRunner(workagentUrl: string, payload: AgentRunRequest) {
//   const agentApiEndpoint = `${workagentUrl}/api/v1/run_sse_v2`;
//   const response = await fetch(agentApiEndpoint, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     // body: JSON.stringify({ prompt, session_id: sessionId }),
//     body: JSON.stringify(payload),
//   });
//   const data = await response.text();
//   return data;
// }

export async function* parseEventStream(
  reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
) {
  try {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      buffer += text;

      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line === "data: [DONE]") {
          console.log("Adk SSE message: [DONE]");
          return;
        }

        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.slice(6);
            const data = JSON.parse(jsonStr);
            yield data;
            // console.log("Adk SSE message:", data);
          } catch (e) {
            // console.error("(Adk sse) Failed to parse SSE message:", line);
            // console.error("Parse error:", e);
            yield {
              type: "error",
              message: `Failed to parse SSE message: ${line}`,
            };
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
