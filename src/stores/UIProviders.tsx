"use client";

import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { MtProgressBar } from "mtxuilib/components/MtProgressBar";
import { TailwindIndicator } from "mtxuilib/components/tailwind-indicator";
import { MtThemeProvider } from "mtxuilib/components/themes/ThemeProvider";
import { SonnerToaster } from "mtxuilib/ui/sonner";
import { Toaster } from "mtxuilib/ui/toaster";
import { TooltipProvider } from "mtxuilib/ui/tooltip";
import type { PropsWithChildren } from "react";

export const UIProviders = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <MtThemeProvider>
      <MtErrorBoundary>
        <MtProgressBar />
        <TooltipProvider delayDuration={0}>
          {/* <ConfirmModalProvider> */}
          {/* <I18nProvider> */}
          {children}
          {/* </I18nProvider> */}
          {/* </ConfirmModalProvider> */}
          <MtProgressBar />
          <SonnerToaster position="top-center" />
          <Toaster />
          <TailwindIndicator />
        </TooltipProvider>
      </MtErrorBoundary>
    </MtThemeProvider>
  );
};
