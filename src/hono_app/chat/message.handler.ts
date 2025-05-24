import { getDbV3 } from "@mtmaiui/db/queries";
import { eq } from "drizzle-orm";
import { chatMessage } from "../../db/schema";
import { createRouter } from "../agent_api/lib/createApp";

export const chatMessageRouter = createRouter();

chatMessageRouter.get("/list", async (c) => {
  const chatId = c.req.query("chatId");

  if (!chatId) {
    return c.json(
      {
        error: "chatId is required",
      },
      400,
    );
  }

  const chatMessages = await getDbV3()
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.chatId, chatId));
  return c.json({
    rows: chatMessages,
  });
});
