"use client";

import { lazy } from "react";

export const LzAssisantFAB = lazy(() =>
  import("./AssisantFAB").then((mod) => ({
    default: mod.AssisantFAB,
  })),
);
