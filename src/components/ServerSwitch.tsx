"use client";

import { useHotkeys } from "react-hotkeys-hook";

export const ServerSwitch = () => {
  useHotkeys("Alt+9", () => {
    console.log("ServerSwitch");
  });
  return <div>ServerSwitch</div>;
};
