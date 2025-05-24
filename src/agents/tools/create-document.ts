import { type DataStreamWriter, tool } from "ai";
import { generateUUID } from "mtxuilib/lib/utils";
import type { Session } from "next-auth";
import { z } from "zod";
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from "../../aichatbot/lib/artifacts/server";

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
  tool({
    description:
      "Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.",
    parameters: z.object({
      title: z.string(),
      kind: z.enum(artifactKinds),
    }),
    execute: async ({ title, kind }) => {
      try {
        const id = generateUUID();

        dataStream.writeData({
          type: "kind",
          content: kind,
        });

        dataStream.writeData({
          type: "id",
          content: id,
        });

        dataStream.writeData({
          type: "title",
          content: title,
        });

        dataStream.writeData({
          type: "clear",
          content: "",
        });

        const documentHandler = documentHandlersByArtifactKind.find(
          (documentHandlerByArtifactKind) => documentHandlerByArtifactKind.kind === kind,
        );

        if (!documentHandler) {
          // throw new Error(`No document handler found for kind: ${kind}`);
          return {
            id: "",
            title: "",
            kind: "",
            content: `No document handler found for kind: ${kind}`,
          };
        }

        await documentHandler.onCreateDocument({
          id,
          title,
          dataStream,
          session,
        });

        dataStream.writeData({ type: "finish", content: "" });

        return {
          id,
          title,
          kind,
          content: "A document was created and is now visible to the user.",
        };
      } catch (error: any) {
        console.error(error);
        return {
          id: "",
          title: "",
          kind: "",
          content: `An error occurred while creating the document.${error}${error.stack}`,
        };
      }
    },
  });
