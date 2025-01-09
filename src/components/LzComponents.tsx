"use client";

import dynamic from "next/dynamic";
import { AssistantDevToolsPanel } from "./AssistantDevTools";

export const getViewByName = (name: string) => {
  switch (name) {
    // case "listview":
    //   return DataListview;
    case "appgen":
      return LzWebContainerWorkbench;
    case "devtools":
      return () => <AssistantDevToolsPanel initialOpen={true} />;
    // case "tasks":
    //   return TaskListView;
    default:
      return () => (
        <div className="flex w-full h-full items-center justify-center">
          <div className="text-center flex-col flex h-full w-full flex-1 mx-auto">
            <div>unknown view</div>
            <div className="text-red-500">{name}</div>
          </div>
        </div>
      );
  }
};

export const LzChatClient = dynamic(
  () => import("../components/chat/Chat.client").then((x) => x.ChatClient),
  {
    ssr: false,
  },
);

export const LzWebContainerWorkbench = dynamic(
  () =>
    import("./workbench/webcontainer_workbench/WebContainerWorkbench").then(
      (x) => x.WebContainerWorkbench,
    ),
  {
    ssr: false,
  },
);
