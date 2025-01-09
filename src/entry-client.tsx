import { MtmaiFrontApp } from "./lib";
const mainApp = new MtmaiFrontApp({
  routerType: "memory",
  mountType: "normal",
});
mainApp.mount();
