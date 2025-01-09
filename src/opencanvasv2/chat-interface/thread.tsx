"use client";
import type { Thread as ThreadType } from "@langchain/langgraph-sdk";
import { ArrowDownIcon, SquarePen } from "lucide-react";
import type { ProgrammingLanguageOptions } from "mtxuilib/types";
import type { Dispatch, FC, SetStateAction } from "react";

import { ThreadPrimitive } from "@assistant-ui/react";
import { TooltipIconButton } from "mtxuilib/assistant-ui/tooltip-icon-button";
import { TighterText } from "mtxuilib/mt/TighterText";
import { useToast } from "mtxuilib/ui/use-toast";
import { useUser } from "../../hooks";
import { useGraphStore } from "../../stores/GraphContextV2";
import { DebugViewCanvas } from "../DebugViewCanvas";
import { ReflectionsDialog } from "../reflections-dialog/ReflectionsDialog";
import { useLangSmithLinkToolUI } from "../tool-hooks/LangSmithLinkToolUI";
import { Composer } from "./composer";
import { AssistantMessage, UserMessage } from "./messages";
import ModelSelector from "./model-selector";
import { ThreadHistory } from "./thread-history";
import { ThreadWelcome } from "./welcome";

const ThreadScrollToBottom = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

export interface ThreadProps {
  userId: string | undefined;
  hasChatStarted: boolean;
  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
  setChatStarted: Dispatch<SetStateAction<boolean>>;
  switchSelectedThreadCallback: (thread: ThreadType) => void;
}

export const Thread: FC<ThreadProps> = (props: ThreadProps) => {
  const {
    setChatStarted,
    hasChatStarted,
    handleQuickStart,
    switchSelectedThreadCallback,
  } = props;
  const { toast } = useToast();
  // const {
  //   threadData: { createThread, modelName, setModelName },
  //   assistantsData: { selectedAssistant },
  //   graphData: { clearState, runId, feedbackSubmitted, setFeedbackSubmitted },
  // } = useGraphContextV2();
  const user = useUser();
  const modelName = useGraphStore((x) => x.modelName);
  const setModelName = useGraphStore((x) => x.setModelName);
  useLangSmithLinkToolUI();
  const selectedAssistant = useGraphStore((x) => x.selectedAssistant);
  const setSelectedAssistant = useGraphStore((x) => x.setSelectedAssistant);
  const feedbackSubmitted = useGraphStore((x) => x.feedbackSubmitted);
  const setFeedbackSubmitted = useGraphStore((x) => x.setFeedbackSubmitted);
  const runId = useGraphStore((x) => x.runId);

  const handleCreateThread = async () => {
    setModelName(modelName);
    // clearState();
    setChatStarted(false);
    // const thread = await createThread(modelName, user?.metadata.id);
    // if (!thread) {
    //   toast({
    //     title: "Failed to create a new thread",
    //     duration: 5000,
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <ThreadPrimitive.Root className="flex flex-col h-full">
      <div className="pr-3 pl-6 pt-3 pb-2 flex flex-row gap-4 items-center justify-between">
        <div className="flex items-center justify-start gap-2 text-gray-600">
          {/* 工具栏 */}
          <ThreadHistory
            switchSelectedThreadCallback={switchSelectedThreadCallback}
          />
          <TighterText className="text-xl">Mtmai</TighterText>
          {!hasChatStarted && (
            <ModelSelector
              chatStarted={false}
              modelName={modelName}
              setModelName={setModelName}
            />
          )}
          <DebugViewCanvas />
        </div>
        {hasChatStarted ? (
          <TooltipIconButton
            tooltip="New chat"
            variant="ghost"
            className="w-fit h-fit p-2"
            delayDuration={400}
            onClick={handleCreateThread}
          >
            <SquarePen className="w-6 h-6 text-gray-600" />
          </TooltipIconButton>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <ReflectionsDialog selectedAssistant={selectedAssistant} />
          </div>
        )}
      </div>
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto scroll-smooth bg-inherit px-4 pt-8">
        {!hasChatStarted && (
          <ThreadWelcome
            handleQuickStart={handleQuickStart}
            composer={<Composer chatStarted={false} userId={props.userId} />}
          />
        )}
        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            AssistantMessage: (prop) => (
              <AssistantMessage
                {...prop}
                feedbackSubmitted={feedbackSubmitted}
                setFeedbackSubmitted={setFeedbackSubmitted}
                runId={runId}
              />
            ),
          }}
        />
      </ThreadPrimitive.Viewport>
      <div className="mt-4 flex w-full flex-col items-center justify-end rounded-t-lg bg-inherit pb-4 px-4">
        <ThreadScrollToBottom />
        <div className="w-full max-w-2xl">
          {hasChatStarted && (
            <div className="flex flex-col space-y-2">
              <ModelSelector
                chatStarted={true}
                modelName={modelName}
                setModelName={setModelName}
              />
              <Composer chatStarted={true} userId={props.userId} />
            </div>
          )}
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
};
