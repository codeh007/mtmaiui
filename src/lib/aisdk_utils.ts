import type { Attachment, UIMessage } from "ai";
import type { DBChatMessage } from "../db/schema";
export function convertToUIMessages(messages: Array<DBChatMessage>): Array<UIMessage> {
  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage["parts"],
    role: message.role as UIMessage["role"],
    // Note: content will soon be deprecated in @ai-sdk/react
    content: "",
    createdAt: message.createdAt,
    experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
  }));
}

/** 参考函数: */

// export async function deleteTrailingMessages({ id }: { id: string }) {
//   const [message] = await getMessageById({ id });

//   await deleteMessagesByChatIdAfterTimestamp({
//     chatId: message.chatId,
//     timestamp: message.createdAt,
//   });
// }

// export async function updateChatVisibility({
//   chatId,
//   visibility,
// }: {
//   chatId: string;
//   visibility: VisibilityType;
// }) {
//   await updateChatVisiblityById({ chatId, visibility });
// }

// 备忘:
//import { after } from "next/server";
// import { type ResumableStreamContext, createResumableStreamContext } from "resumable-stream";
// let globalStreamContext: ResumableStreamContext | null = null;

// export function getStreamContext() {
//   if (!globalStreamContext) {
//     try {
//       globalStreamContext = createResumableStreamContext({
//         waitUntil: after,
//       });
//     } catch (error: any) {
//       if (error.message.includes("REDIS_URL")) {
//         console.log(" > Resumable streams are disabled due to missing REDIS_URL");
//       } else {
//         console.error(error);
//       }
//     }
//   }

//   return globalStreamContext;
// }
