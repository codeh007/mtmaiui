import { UIProviders } from "mtmaiui/stores/UIProviders";
import { fontSans } from "mtxuilib/fonts";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { ThemeHeaderScript } from "mtxuilib/components/themes/ThemeProvider";

import { getAccessToken, getBackendUrl, getHostName } from "mtxuilib/lib/sslib";
import { cn } from "mtxuilib/lib/utils";
import { MtmaiProvider } from "../../stores/StoreProvider";
import "./globals.css";
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
  // await initGomtmApp({
  //   headers: headers,
  //   cookies: cookies,
  // });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeHeaderScript />
        {/* <MtmaiuiLoaderScript uiUrl={selfUrl} /> */}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <MtmaiProvider
          // frontendConfig={await getFrontendConfig()}
          hostName={await getHostName()}
          serverUrl={await getBackendUrl()}
          selfBackendUrl={await getBackendUrl()}
          accessToken={await getAccessToken()}
        >
          <UIProviders>
            <div className="flex flex-col min-h-screen h-full w-full">
              {/* <WebLayoutHeader /> */}
              {children}
            </div>
          </UIProviders>
        </MtmaiProvider>
      </body>
    </html>
  );
}
