"use client";
import { StrictMode } from "react";
// import ReactDOM from "react-dom/client";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";

interface MtmaiFrontAppOptions {
  routerType: "memory" | "hash";
  mountType?: "normal" | "shadow";
}
export class MtmaiFrontApp {
  private rootElementId = "mtmaiapp_slug";
  private css = "/assets/mamai_assistant.css";
  constructor(private options: MtmaiFrontAppOptions) {}
  mount = () => {
    console.log("MtmaiFrontApp options:", this.options);
    //提示,在 edgeruntime 下, 不支持直接访问 import.meta
    // console.log("entry-client loaded \n import.meta:", import.meta);

    let rootElement = document.getElementById(
      this.rootElementId,
    ) as HTMLElement;
    if (!rootElement) {
      rootElement = document.createElement("div");
      rootElement.id = this.rootElementId;
      document.body.appendChild(rootElement);
    }
    if (this.options.mountType === "normal") {
      //开发环境
      console.log("mtmai dev");
      const root = createRoot(rootElement);
      root.render(<App />);
      // hydrateRoot(
      //   rootElement,
      //   <StrictMode>
      //     <App />
      //   </StrictMode>,
      // );
    } else {
      //集成挂载,使用 shadow dom
      console.log("mtmai shadow");
      // 创建 Shadow DOM
      const shadowRoot = rootElement.attachShadow({ mode: "open" });
      // 添加样式
      const styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = this.css;
      shadowRoot.appendChild(styleLink);

      // 创建挂载点
      // const mountPoint = document.createElement("div");
      // shadowRoot.appendChild(mountPoint);
      // rootElement = mountPoint;
      hydrateRoot(
        shadowRoot,
        <StrictMode>
          <App />
        </StrictMode>,
      );
    }
  };
  unmount = () => {
    const container = document.getElementById(this.rootElementId);
    if (container) {
      document.body.removeChild(container);
    }
  };
}
