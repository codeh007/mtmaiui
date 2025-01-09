import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";

const elementId = "mtmaiapp_slug";
const css = "/assets/mamai_assistant.css";

const router = createRouter();
// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


export function mountMTMaiApp() {
  let rootElement = document.getElementById(elementId);

  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = elementId;

    // 创建 Shadow DOM
  const shadowRoot = rootElement.attachShadow({ mode: 'open' });
  // const mountPoint = document.createElement('div');
  shadowRoot.appendChild(mountPoint);

    // document.body.appendChild(rootElement);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = css;
    document.head.appendChild(link);
  }

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<RouterProvider router={router} />);
    // hydrateRoot(rootElement, <RouterProvider router={router} />);
  }
}


// 确保在 DOM 加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMTMaiApp);


} else {
  // 自动执行挂载（当直接加载脚本时）
if (typeof window !== "undefined") {
  mountMTMaiApp();
}
}



// 可选：暴露全局接口供外部调用
window.MtmaiAssistant = {
  // 例如提供销毁方法
  unmount: () => {
    const container = document.getElementById(elementId);
    if (container) {
      document.body.removeChild(container);
    }
  }
};