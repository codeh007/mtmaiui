// export const runtime = "edge";
const handler = async (r: Request) => {
  const hfSpace = process.env.HF_SPACE;
  const hfToken = process.env.HF_TOKEN;

  // 这里的参数按顺序对应 graio app 对应的函数的参数顺序.
  const payload = [
    "Hello!!", // message
    [], // history
    "You are a friendly Chatbot.", // system message
    512, // max tokens
    0.7, // temperature
    0.95, // top_p
  ];
  // First make the initial POST request to start the chat
  const startResponse = await fetch(`https://${hfSpace}.hf.space/gradio_api/call/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hfToken}`,
    },

    body: JSON.stringify(payload),
  });

  const response = await startResponse.json();
  const startResult = response as { event_id: string };
  // Then make the follow-up request to get the stream
  const streamResponse = await fetch(
    `https://${hfSpace}.hf.space/gradio_api/call/chat/${startResult.event_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${hfToken}`,
      },
    },
  );

  // Transform and process the stream to only send new tokens
  const reader = streamResponse.body?.getReader();
  const encoder = new TextEncoder();
  let lastMessage = "";

  // 解释 gradio 的 tokens 的流, 转换为 vercel 的 event-stream 格式
  // gradio 的特点是,返回的event , 是完整的消息,这里解释为增量消息
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              const newMessage = data[0] || "";

              // Only send the new tokens by comparing with last message
              const newTokens = newMessage.slice(lastMessage.length);
              lastMessage = newMessage;

              // 增量 token 流
              if (newTokens) {
                const event = `0:"${newTokens}"\n`;
                controller.enqueue(encoder.encode(event));
              }
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

export const GET = handler;
export const POST = handler;
