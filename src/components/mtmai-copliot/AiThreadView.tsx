"use client";

import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { Suspense, useEffect, useMemo } from "react";
import { CopliotUserMenus } from "../mtmai-copliot/CopliotUserMenus";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { TailwindIndicator } from "mtxuilib/components/tailwind-indicator";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { Toaster } from "mtxuilib/ui/sonner";
import { CopliotFAB } from "./CopliotFAB";
import { MessagesScreen } from "./MessagesScreen";
import { PlaygroundScreen } from "./PlaygroundScreen";
import { ReactQueryDevtoolsProduction } from "mtxuilib/components/devtools/DevToolsView";
/**
 * Ai 任务线程视图
 * 1: 连接后，后端会发送需要填写的任务参数表单到前端
 * 2: 前端填写表单后，提交表单，后端会根据表单内容，创建一个ai线程，并开始执行ai任务
 * 3: 执行过程中，可以双向交互
 * @param param0
 * @returns
 */
export const AiThreadView = (props: AiThreadProps) => {
  return (
    <AiThreadProvider {...props}>
      <AiThreadViewInner />
      <CopliotFAB />
      {/* <DashPopupFormPanel /> */}
      <ReactQueryDevtoolsProduction
        initialIsOpen={true}
        position="left"
        buttonPosition="bottom-left"
      />
      <SonnerToster position="top-center" />
      <Toaster />
      <TailwindIndicator />
    </AiThreadProvider>
  );
};

const AiThreadViewInner = () => {
  const autoConnect = useThreadStore((x) => x.autoConnect);
  // const askForm = useThreadStore((x) => x.askForm);
  // const chatProfile = useThreadStore((x) => x.chatProfile);
  const threadUiState = useThreadStore((x) => x.threadUiState);

  const isOpen = useThreadStore((x) => x.threadUiState.isOpen);
  const setThreadUiState = useThreadStore((x) => x.setThreadUiState);
  const handleClose = () => {
    setThreadUiState({
      ...threadUiState,
      isOpen: false,
    });
  };

  const activateViewName = useThreadStore(
    (x) => x.threadUiState.activateViewName,
  );
  const router = useMtRouterV2();

  const inputPosition = useThreadStore(
    (x) => x.threadUiState?.inputPosition || "bottom",
  );

  const isConnected = useThreadStore((x) => x.isConnected);
  const isLoading = useMemo(() => {
    return !isConnected;
  }, [isConnected]);

  const setCanConnect = useThreadStore((x) => x.setCanConnect);
  const form = useZodForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (autoConnect) {
      setCanConnect(true);
    }
  }, [autoConnect, setCanConnect]);

  const handleSubmit = (data) => {
    setCanConnect(true);
  };

  return (
    <MtErrorBoundary>
      <div
        className={cn(
          "border bg-background h-full flex flex-col fixed bottom-0 right-0 w-96 border-l border-gray-200 ",
          !isOpen && "hidden",
        )}
      >
        {isLoading && <ColpiotLoading />}
        <div
          className={cn(
            isLoading ? "hidden" : "flex",
            "flex-col w-full h-full",
          )}
        >
          <header className="flex-shrink-0 h-12 flex gap-2 p-1">
            <div className="flex-1 flex gap-1">
              {threadUiState?.screens?.map((screen, i) => {
                return (
                  <button
                    type="button"
                    key={screen.id}
                    onClick={() => {
                      router.push(screen.id);
                    }}
                    className={cn(
                      "cursor-pointer p-1 rounded-md",
                      activateViewName === screen.id && "bg-muted",
                    )}
                  >
                    {screen.label}
                  </button>
                );
              })}
            </div>
            <div className="min-w-12 flex items-center justify-center">
              <Suspense>
                <CopliotUserMenus />
                <IconButton
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <Icons.X className="size-4" />
                </IconButton>
              </Suspense>
            </div>
          </header>

          <MtScrollArea
            className="flex-grow p-1"
            showScrollButton={true}
            autoScrollToBottom={true}
          >
            {!autoConnect && (
              <ZForm form={form} handleSubmit={handleSubmit}>
                <MtButton type="submit">开始</MtButton>
              </ZForm>
            )}
            <MessagesScreen />
            <DataListView />
            <OperationScreen />
            <PlaygroundScreen />
            {inputPosition === "inline" && <InputBoxV2 />}
          </MtScrollArea>
          <footer className="flex-shrink-0 h-10 flex items-center justify-center">
            {inputPosition === "bottom" && <InputBoxV2 />}
          </footer>
        </div>
      </div>
    </MtErrorBoundary>
  );
};

/**
 * 正在连接
 * @returns
 */
const ColpiotLoading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background flex-col">
      <Icons.reload className="mr-2 size-8 animate-spin" />
      <div>loading</div>
    </div>
  );
};
