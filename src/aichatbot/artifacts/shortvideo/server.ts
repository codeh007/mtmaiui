import { smoothStream, streamText } from "ai";
import { updateDocumentPrompt } from "../../../agent_utils/prompts";
import { myProvider } from "../../../agent_utils/providers";
import { createDocumentHandler } from "../../lib/artifacts/server";

export const shortVideoHandler = createDocumentHandler<"shortvideo">({
  kind: "shortvideo",
  onCreateDocument: async ({ title, dataStream }) => {
    console.log("shortvideoHandler onCreateDocument", title);
    let draftContent = "";

    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system: `你是有十年经验的短视频UP主, 擅长编写各种适合在 tiktok 短视频平台播放的视频脚本.
**脚本要求**
1. 脚本需要符合 tiktok 平台的要求, 不要包含任何违法违规内容.
2. 脚本需要有足够的话题性, 能够吸引用户观看.
3. 不要任何解释, 直接输出脚本.



`,
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: title,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "text-delta") {
        const { textDelta } = delta;

        draftContent += textDelta;

        dataStream.writeData({
          type: "text-delta",
          content: textDelta,
        });
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    console.log("shortvideoHandler onUpdateDocument", document, description);
    let draftContent = "";

    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system: updateDocumentPrompt(document.content, "text"),
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: description,
      experimental_providerMetadata: {
        openai: {
          prediction: {
            type: "content",
            content: document.content,
          },
        },
      },
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "text-delta") {
        const { textDelta } = delta;

        draftContent += textDelta;
        dataStream.writeData({
          type: "text-delta",
          content: textDelta,
        });
      }
    }

    console.log("shortvideoHandler onUpdateDocument, draftContent:", draftContent);
    return draftContent;
  },
});
