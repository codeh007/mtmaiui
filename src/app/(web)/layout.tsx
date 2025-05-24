import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";
import { cn } from "mtxuilib/lib/utils";
import { MtmaiProvider } from "../../stores/MtmaiProvider";
import "../../styles/globals.css";
import { AppLoader } from "@mtmaiui/AppLoader";
import { getAppConfig } from "@mtmaiui/lib/config";
import { UIProviders } from "@mtmaiui/stores/UIProviders";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { WebLayoutHeader } from "./Header";
export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function Layout(props: {
  children: ReactNode;
}) {
  const { children } = props;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeHeaderScript />
        {/* <MtmaiuiLoaderScript uiUrl={selfUrl} /> */}
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <MtmaiProvider serverUrl={getAppConfig().mtmServerUrl}>
          <MtSuspenseBoundary>
            <UIProviders>
              <div className="flex flex-col min-h-screen h-full w-full">
                <WebLayoutHeader />
                <MtSuspenseBoundary>{children}</MtSuspenseBoundary>
                <AppLoader serverUrl={getAppConfig().mtmServerUrl} />
              </div>
            </UIProviders>
          </MtSuspenseBoundary>
        </MtmaiProvider>
      </body>
    </html>
  );
}
