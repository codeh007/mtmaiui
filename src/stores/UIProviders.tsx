"use client";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { TailwindIndicator } from "mtxuilib/components/tailwind-indicator";
import { MtThemeProvider } from "mtxuilib/components/themes/ThemeProvider";
import { TooltipProvider } from "mtxuilib/ui/tooltip";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

const MtProgressBarLazy = dynamic(
  () => import("mtxuilib/components/MtProgressBar").then((x) => x.MtProgressBar),
  {
    ssr: false,
  },
);

const SonnerToasterLazy = dynamic(() => import("mtxuilib/ui/sonner").then((x) => x.Toaster), {
  ssr: false,
});
const ToasterLazy = dynamic(() => import("mtxuilib/ui/toaster").then((x) => x.Toaster), {
  ssr: false,
});

const DevToolsLazy = dynamic(
  () => import("mtxuilib/components/devtools/DevTools").then((x) => x.DevTools),
  {
    ssr: false,
  },
);

// const AppLazy = dynamic(() => import("../App").then((x) => x.App), {
//   ssr: false,
// });

export const UIProviders = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <MtThemeProvider>
      <MtErrorBoundary>
        <MtProgressBarLazy />
        <TooltipProvider delayDuration={0}>
          {children}
          <SonnerToasterLazy position="top-center" />
          <ToasterLazy />
          <TailwindIndicator />
          {/* <AppLazy /> */}
          <DevToolsLazy />
        </TooltipProvider>
      </MtErrorBoundary>
    </MtThemeProvider>
  );
};
