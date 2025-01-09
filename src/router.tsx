import {
  createBrowserHistory,
  createMemoryHistory,
  createRouter as createTanstackRouter,
} from "@tanstack/react-router";
import SuperJSON from "superjson";

import { routeTree } from "./routeTree.gen";

export type RouterMode = "memory" | "browser" | "hash";
// export function createAppRouter(mode: RouterMode = "memory"): RouterHistory {
//   const history = (() => {
//     switch (mode) {
//       case "memory":
//         return createMemoryHistory();
//       case "browser":
//         return createBrowserHistory();
//       // case 'hash':
//       //   return createHashHistory();
//     }
//   })();
//   return createBrowserHistory();

//   // return createRouter({
//   //   routeTree,
//   //   defaultPreload: "intent",
//   //   defaultStaleTime: 5000,
//   //   history,
//   // });
// }
// 创建 memory history 实例
// const memoryHistory = createMemoryHistory();

// Set up a Router instance
// export const router = createTanstackRouter({
//   routeTree,
//   defaultPreload: "intent",
//   defaultStaleTime: 5000,
//   // context: {
//   //   head: "",
//   // },
//   // transformer: SuperJSON,
//   history: createAppRouter("memory"), // 使用 memory history 而不是默认的 browser history
// });

export function createAppRouter(mode: RouterMode = "memory") {
  switch (mode) {
    case "memory":
      return createMemoryHistory();
    case "browser":
      return createBrowserHistory();
    default:
      return createMemoryHistory();
  }
}
export function createRouter() {
  const router = createTanstackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultStaleTime: 5000,
    context: {
      head: "",
    },
    transformer: SuperJSON,
    history: createAppRouter("memory"),
  });
  return router;
}
