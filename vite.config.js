import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  define: {
    // 添加这个配置来模拟 process.env
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  },
  resolve: {
    alias: {
      // 添加 mtmaiapi 的路径别名
      'mtmaiapi': resolve(__dirname, '../mtmaiapi/src'),
      // 如果还有其他类似的包也需要解析，可以继续添加
      'mtxuilib': resolve(__dirname, '../mtxuilib/src'),
      'mtmaiui': resolve(__dirname, '../mtmaiui/src'),
    }
  },
  server: {
    port: 6111,
    cors: true, // 启用 CORS
    env: {
      isDev: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  },
  build: {
    // lib: {
    //   entry: resolve(__dirname, "lib/hello123.ts"),
    //   name: "hello123",
    //   // the proper extensions will be added
    //   fileName: "hello123",
    // },
    manifest: true,
    // lib: {
    //   entry: "src/lib/hello123.ts",
    //   name: "hello123",
    //   fileName: "hello123",
    //   formats: ["es"],
    // },
    // overwrite default .html entry
    // input: "src/entry-client.tsx",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        // nested: resolve(__dirname, "src/nested/index.html"),
      },
    },
  },
});
