"use client";

import type { ALL_MODEL_NAMES } from "mtxuilib/constants";
import { getLanguageTemplate } from "mtxuilib/lib/get_language_template";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
import type {
  ArtifactCodeV3,
  ArtifactMarkdownV3,
  ArtifactV3,
  ProgrammingLanguageOptions,
} from "mtxuilib/types/opencanvasTypes";
import { useToast } from "mtxuilib/ui/use-toast";
import React, { useState } from "react";
import { useUser } from "../../hooks/useAuth";
import { useGraphStore } from "../../stores/GraphContextV2";
import { LzArtifactRenderer } from "../LzComponents";
import { ContentComposerChatInterface } from "./content-composer";

export function CanvasComponent() {
  const user = useUser();
  const agentNode = useGraphStore((x) => x.agentNode);
  // const { threadId, clearThreadsWithNoValues, setModelName } = threadData;
  // const { setArtifact } = graphData;
  const { toast } = useToast();
  const [chatStarted, setChatStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   if (!threadId || !user) return;
  //   // Clear threads with no values
  //   clearThreadsWithNoValues(user?.id);
  // }, [threadId, user]);

  const handleQuickStart = (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => {
    if (type === "code" && !language) {
      toast({
        title: "Language not selected",
        description: "Please select a language to continue",
        duration: 5000,
      });
      return;
    }
    setChatStarted(true);

    let artifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
    if (type === "code" && language) {
      artifactContent = {
        index: 1,
        type: "code",
        title: `Quick start ${type}`,
        code: getLanguageTemplate(language),
        language,
      };
    } else {
      artifactContent = {
        index: 1,
        type: "text",
        title: `Quick start ${type}`,
        fullMarkdown: "",
      };
    }

    const newArtifact: ArtifactV3 = {
      currentIndex: 1,
      contents: [artifactContent],
    };
    // Do not worry about existing items in state. This should
    // never occur since this action can only be invoked if
    // there are no messages/artifacts in the thread.
    setArtifact(newArtifact);
    setIsEditing(true);
  };

  return (
    <main className="h-screen flex flex-row">
      <div
        className={cn(
          "transition-all duration-700",
          chatStarted ? "w-[35%]" : "w-full",
          "h-full mr-auto bg-gray-50/70 shadow-inner-right",
        )}
      >
        <ContentComposerChatInterface
          switchSelectedThreadCallback={(thread) => {
            // Chat should only be "started" if there are messages present
            if ((thread.values as Record<string, any>)?.messages?.length) {
              setChatStarted(true);
              setModelName(
                thread?.metadata?.customModelName as ALL_MODEL_NAMES,
              );
            } else {
              setChatStarted(false);
            }
          }}
          setChatStarted={setChatStarted}
          hasChatStarted={chatStarted}
          handleQuickStart={handleQuickStart}
        />
      </div>
      <MtSuspenseBoundary>
        {chatStarted && (
          <div className="w-full ml-auto">
            <LzArtifactRenderer
              setIsEditing={setIsEditing}
              isEditing={isEditing}
            />
          </div>
        )}
      </MtSuspenseBoundary>
    </main>
  );
}

export const Canvas = React.memo(CanvasComponent);
