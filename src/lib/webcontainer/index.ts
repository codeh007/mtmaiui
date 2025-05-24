"use client";
import { WebContainer } from "@webcontainer/api";
import { WORK_DIR_NAME } from "../constants";

interface WebContainerContext {
  loaded: boolean;
}

export const webcontainerContext: WebContainerContext = {
  loaded: false,
};

export const webcontainer = Promise.resolve()
  .then(() => {
    if (typeof window === "undefined") {
      return Promise.resolve(null);
    }
    console.log("booting webcontainer");
    return WebContainer.boot({ workdirName: WORK_DIR_NAME });
  })
  .then((webcontainer) => {
    if (webcontainer) {
      webcontainerContext.loaded = true;
    }
    return webcontainer;
  });
