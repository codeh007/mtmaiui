"use client";

import dynamic from "next/dynamic";

export const LzMoutDynDash = dynamic(
  import("./MoutDynDash").then((x) => x.MoutDynDash),
  {
    ssr: false,
  },
);
