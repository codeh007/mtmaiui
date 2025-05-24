import type { Manifest } from 'vite';

/*******************************************************************************************
 * 用途: 在 nextjs 作为主应用的情况下,再叠加另外一个纯前端的 vite react微应用.
 * 重要: [功能已经放弃]
 *      原因是 nextjs 本身已经可以做到这点, 如果再 使用vite, 就相当于两个程序,虽然可以公用一些库,
 *      不管是开发阶段还是部署阶段, 都大大增加了复杂度.
 * 
 * 如何使用: nextjs 实现这个功能?
 *     1: 所有使用 类似 await import("./some.tsx") 的语句都会让nextjs 将这个文件打包到独立文件中.
 *        找到这个文件的方法是通过.next/react-loadable-manifest.json 这个文件
 *        根据文件名,找到最终构建的文件
 * 
 *******************************************************************************************/
export class MTMAIUILoader {
  private baseUrl: string;
  private manifest: Manifest | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  async init() {
    const manifestUrl = `${this.baseUrl}.vite/manifest.json`;
    const response = await fetch(manifestUrl);
    this.manifest = await response.json();
  }

  private async loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.type = 'module';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private async loadCSS(url: string): Promise<void> {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  //加载生产环境的脚本
  async loadProduction() {
    if (!this.manifest) {
      await this.init();
    }
    if(!this.manifest) throw new Error("manifest is null");
    // 找到入口文件
    const entryPoint = Object.entries(this.manifest).find(
      ([_, entry]) => entry.isEntry
    );

    if (!entryPoint) {
      throw new Error('No entry point found in manifest');
    }

    const [_, entry] = entryPoint;

    // 加载 CSS
    if (entry.css) {
      await Promise.all(
        entry.css.map((css) => this.loadCSS(`${this.baseUrl}${css}`))
      );
    }
    await this.loadScript(`${this.baseUrl}${entry.file}`);
  }

  //加载开发环境的脚本
  async loadLoadDevelopment(viteServerUrl: string, entrySrcName="/src/entry-client.tsx") {
    // css
    // const cssSrc="/src/styles/globals.css"
    // this.loadCSS(`${viteServerUrl}${cssSrc}`);
    // 加载 Vite 客户端
    await import(`${viteServerUrl}/@vite/client`);
    const RefreshRuntime = (await import(`${viteServerUrl}/@react-refresh`)).default;
    RefreshRuntime.injectIntoGlobalHook(window);
    //@ts-ignore
    window.$RefreshReg$ = () => {};
    //@ts-ignore
    window.$RefreshSig$ = () => (type) => type;
    //@ts-ignore
    window.__vite_plugin_react_preamble_installed__ = true;
    // 应用入口
    await import(`${viteServerUrl}${entrySrcName}`);
    
    // await this.loadCSS(`${viteServerUrl}/${cssSrc}`);
    return;
  }
}

if(typeof window !== "undefined"){
  const nextJsDevDomains = ["colab-3600.yuepa8.com"];
  const domain = window.location.hostname;
  if (nextJsDevDomains.includes(domain)) {
    //开发环境
    const baseUrl = 'https://colab-6111.yuepa8.com';
    const loader = new MTMAIUILoader(baseUrl);
    loader.loadLoadDevelopment(baseUrl).catch(console.error);
  }else{
    const baseUrl = "/mtmaiui";

    const loader = new MTMAIUILoader(baseUrl);
    loader.loadProduction().catch(console.error);
  }
}
