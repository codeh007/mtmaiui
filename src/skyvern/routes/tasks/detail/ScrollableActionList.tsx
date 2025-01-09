"use client";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef } from "react";
import { type Action, ActionTypes } from "../../../api/types";
import { ScrollArea, ScrollAreaViewport } from "../../../ui/scroll-area";
import { ActionTypePill } from "./ActionTypePill";

type Props = {
  taskId: string;
  data: Array<Action | null>;
  onNext: () => void;
  onPrevious: () => void;
  onActiveIndexChange: (index: number | "stream") => void;
  activeIndex: number | "stream";
  showStreamOption: boolean;
  taskDetails: {
    steps: number;
    actions: number;
    cost?: string;
  };
};

export function ScrollableActionList({
  taskId,
  data,
  activeIndex,
  onActiveIndexChange,
  showStreamOption,
  taskDetails,
}: Props) {
  const queryClient = useQueryClient();
  const refs = useRef<Array<HTMLDivElement | null>>(
    Array.from({ length: data.length + 1 }),
  );

  useEffect(() => {
    if (typeof activeIndex === "number" && refs.current[activeIndex]) {
      refs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    if (activeIndex === "stream") {
      refs.current[data.length]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex, data.length]);

  const handlerMouseEnter = (action: Action) => {
    // console.log("handlerMouseEnter", action);
    queryClient.prefetchQuery({
      // queryKey: ["task", taskId, "steps", action.stepId, "artifacts"],
      // queryFn: async () => {
      // 	const client = await getClient(credentialGetter);
      // 	return client
      // 		.get(`/tasks/${taskId}/steps/${action.stepId}/artifacts`)
      // 		.then((response) => response.data);
      // },
      // ...agentGetAgentTaskStepArtifactsOptions({
      //   path: {
      //     task_id: taskId,
      //     step_id: action.stepId,
      //   },
      // }),
    });
  };
  function getReverseActions() {
    const elements: ReactNode[] = [];
    for (let i = data.length - 1; i >= 0; i--) {
      const action = data[i];
      const actionIndex = data.length - i - 1;
      if (!action) {
        continue;
      }
      const selected = activeIndex === actionIndex;
      elements.push(
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          key={i}
          ref={(element) => {
            refs.current[actionIndex] = element;
          }}
          className={cn(
            "flex cursor-pointer rounded-lg border-2 bg-slate-elevation3 hover:border-slate-50",
            {
              "border-l-destructive": !action.success,
              "border-l-success": action.success,
              "border-slate-50": selected,
            },
          )}
          onClick={() => onActiveIndexChange(actionIndex)}
          onMouseEnter={() => {
            handlerMouseEnter(action);
          }}
        >
          <div className="flex-1 space-y-2 p-4 pl-5">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span>#{i + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <ActionTypePill actionType={action.type} />
                {action.success ? (
                  <div className="flex gap-1 rounded-sm bg-slate-elevation5 px-2 py-1">
                    <CheckCircledIcon className="h-4 w-4 text-success" />
                    <span className="text-xs">Success</span>
                  </div>
                ) : (
                  <div className="flex gap-1 rounded-sm bg-slate-elevation5 px-2 py-1">
                    <CrossCircledIcon className="h-4 w-4 text-destructive" />
                    <span className="text-xs">Fail</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-400">{action.reasoning}</div>
            {action.type === ActionTypes.InputText && (
              <>
                <Separator />
                <div className="text-xs text-slate-400">
                  Input: {action.input}
                </div>
              </>
            )}
          </div>
        </div>,
      );
    }
    return elements;
  }

  return (
    <div className="h-[40rem] w-1/3 rounded border bg-slate-elevation1">
      <div className="grid grid-cols-3 gap-2 p-4">
        <div className="flex h-8 items-center justify-center rounded-sm bg-slate-700 px-3 text-xs text-gray-50">
          步骤: {taskDetails.steps}
        </div>
        <div className="flex h-8 items-center justify-center rounded-sm bg-slate-700 px-3 text-xs text-gray-50">
          动作: {taskDetails.actions}
        </div>
        <div className="flex h-8 items-center justify-center rounded-sm bg-slate-700 px-3 text-xs text-gray-50">
          消耗: {taskDetails.cost}
        </div>
      </div>
      <Separator />
      <ScrollArea className="p-4">
        <ScrollAreaViewport className="max-h-[34rem]">
          <DebugValue data={data} />
          <div className="space-y-4">
            {showStreamOption && (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <div
                key="stream"
                ref={(element) => {
                  refs.current[data.length] = element;
                }}
                className={cn(
                  "flex cursor-pointer rounded-lg border-2 bg-slate-elevation3 p-4 hover:border-slate-50",
                  {
                    "border-slate-50": activeIndex === "stream",
                  },
                )}
                onClick={() => onActiveIndexChange("stream")}
              >
                <div className="flex items-center gap-2">
                  <DotFilledIcon className="h-6 w-6 text-destructive" />
                  Live
                </div>
              </div>
            )}
            {getReverseActions()}
          </div>
        </ScrollAreaViewport>
      </ScrollArea>
    </div>
  );
}
