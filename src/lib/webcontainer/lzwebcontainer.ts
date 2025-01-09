"use client";

import type { WebContainer } from "@webcontainer/api";
import { lazy } from "react";

const globalWebContainer: WebContainer | undefined = undefined;

// const lzwebcontainer = lazy(() =>
//   import("./index").then((mod) => mod.webcontainer),
// );
export const getWebContainer = {
  if(globalWebContainer) {
    return globalWebContainer;
  },
  // const webcontainer = await import("./index").then(mod=> mod.webcontainer)
  // globalWebContainer = webcontainer
  // return webcontainer
};
