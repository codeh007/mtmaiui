import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // cloudflare({
    //   inspectorPort: 9229,
    // }),
    // TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    // react(),
    // tailwindcss(),
  ],
  // environments: {
  //   mtmag: {
  //     define: {
  //       MY_VARIABLE: "MY_VARIABLE9999invite",
  //     },
  //   },
  // },
  // define: {
  //   __dirname: '""',
  //   "process.env": process.env,
  // },
  resolve: {
    alias: {
      mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
      mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "./src/revedio/project.ts"),
      formats: ["es"],
      fileName: "project",
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        preserveModules: true,
      },
    },
  },
  server: {
    port: 6111,
  },
});
