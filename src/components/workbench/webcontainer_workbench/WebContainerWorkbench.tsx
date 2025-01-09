"use client";

import { memo, useCallback, useEffect } from "react";

import type {
  OnChangeCallback as OnEditorChange,
  OnScrollCallback as OnEditorScroll,
} from "../../../components/editor/codemirror/CodeMirrorEditor";

import { computed } from "nanostores";

import { PanelHeaderButton } from "../../ui/PanelHeaderButton";

import { useStore } from "@nanostores/react";
import { Icons } from "mtxuilib/icons/icons";
import { toast } from "react-toastify";
import { WorkbenchView } from "../../../components/WorkbenchView";
import { useWorkbrenchStore } from "../../../stores/workbrench.store";
import { EditorPanel } from "./EditorPanel";
import { Preview } from "./Preview";
import { cn } from "mtxuilib/lib/utils";

export interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

const sliderOptions: SliderOptions<WorkbenchViewType> = {
  left: {
    value: "code",
    text: "Code",
  },
  right: {
    value: "preview",
    text: "Preview",
  },
};

export const WebContainerWorkbench = memo(({ isStreaming }: WorkspaceProps) => {
  renderLogger.trace("WebContainerWorkbench");

  const hasPreview = useStore(
    computed(workbenchStore.previews, (previews) => previews.length > 0),
  );
  const showWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);
  const setShowWorkbench = useWorkbrenchStore((x) => x.setShowWorkbench);
  const selectedFile = useStore(workbenchStore.selectedFile);
  const currentDocument = useStore(workbenchStore.currentDocument);
  const unsavedFiles = useStore(workbenchStore.unsavedFiles);
  const files = useStore(workbenchStore.files);
  const currentView = useWorkbrenchStore((x) => x.currentView);
  const setCurrentView = useWorkbrenchStore((x) => x.setCurrentView);

  // const setSelectedView = (view: WorkbenchViewType) => {
  // 	setCurrentView(view);
  // };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (hasPreview) {
      setCurrentView("preview");
    }
  }, [hasPreview]);

  useEffect(() => {
    workbenchStore.setDocuments(files);
  }, [files]);

  const onEditorChange = useCallback<OnEditorChange>((update) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(() => {
    workbenchStore.saveCurrentDocument().catch(() => {
      toast.error("Failed to update file content");
    });
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  return (
    <div
      className={cn(
        "fixed top-[calc(var(--header-height)+.5rem)] bottom-1 w-[var(--workbench-inner-width)] mr-2 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier",
        {
          "left-[var(--workbench-left)]": showWorkbench,
          "left-[100%]": !showWorkbench,
        },
      )}
    >
      <div className="absolute inset-0 px-1">
        <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
          <div className="flex items-center px-3 py-2 border-b border-bolt-elements-borderColor">
            <MtSlider
              selected={currentView}
              options={sliderOptions}
              setSelected={setCurrentView}
            />

            <div className="ml-auto" />
            {currentView === "code" && (
              <PanelHeaderButton
                className="mr-1 text-sm"
                onClick={() => {
                  workbenchStore.toggleTerminal(
                    !workbenchStore.showTerminal.get(),
                  );
                }}
              >
                <div className="i-ph:terminal" />
                终端
              </PanelHeaderButton>
            )}
            <IconButton
              className="-mr-1"
              size="xl"
              onClick={() => {
                setShowWorkbench(false);
              }}
            >
              <Icons.X className="size-4" />
            </IconButton>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <WorkbenchView
              initial={{ x: currentView === "code" ? 0 : "-100%" }}
              animate={{ x: currentView === "code" ? 0 : "-100%" }}
            >
              <EditorPanel
                editorDocument={currentDocument}
                isStreaming={isStreaming}
                selectedFile={selectedFile}
                files={files}
                unsavedFiles={unsavedFiles}
                onFileSelect={onFileSelect}
                onEditorScroll={onEditorScroll}
                onEditorChange={onEditorChange}
                onFileSave={onFileSave}
                onFileReset={onFileReset}
              />
            </WorkbenchView>
            <WorkbenchView
              initial={{ x: currentView === "preview" ? 0 : "100%" }}
              animate={{ x: currentView === "preview" ? 0 : "100%" }}
            >
              <Preview />
            </WorkbenchView>
          </div>
        </div>
      </div>
    </div>
  );
});
