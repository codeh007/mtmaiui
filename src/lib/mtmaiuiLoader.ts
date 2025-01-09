const devServer = "http://localhost:6111";
const prodServer = "https://mtmaiui.yuepa8.com/";
const loaderScriptSrc = "/mtmaiui_load.js";
export function loadMtmaiuiClientApp(options: {
  isDev?: boolean;
}) {
  const { isDev } = options;
  console.log("loadMtmaiuiClientApp", isDev);

  if (typeof window !== "undefined") {
    const serverUrl = isDev ? devServer : prodServer;
    const script = document.createElement("script");
    script.src = `${serverUrl}${loaderScriptSrc}`;
    script.type = "module";
    script.async = true;
    script.defer = true;
    (document.head || document.body).appendChild(script);
  }
}
