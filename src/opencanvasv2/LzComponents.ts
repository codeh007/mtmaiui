"use client";

import dynamic from "next/dynamic";

export const LzThread = dynamic(
  () => import("./chat-interface/thread").then((mod) => mod.Thread),
  {
    ssr: false,
  },
);

export const LzCanvas = dynamic(
  () => import("./canvas/canvas").then((mod) => mod.Canvas),
  {
    ssr: false,
  },
);

export const LzArtifactRenderer = dynamic(
  () =>
    import("./artifacts/ArtifactRenderer").then((mod) => mod.ArtifactRenderer),
  {
    ssr: false,
  },
);
