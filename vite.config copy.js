import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  define: {
    // 添加这个配置来模拟 process.env
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  },
  build: {
    // lib: {
    //   entry: "src/main.tsx",
    //   name: "MtmaiAssistant",
    //   fileName: "mamai_assistant",
    //   formats: ["iife"], // 使用立即执行函数格式
    // },
    // modulePreload: {
    //   polyfill: true
    // },
    emptyOutDir: false,
    rollupOptions: {

      external: [], // 所有依赖都打包进去
      input: 'src/main.tsx',
      output: {
        format: 'es', // 使用 ES 模块格式

        // 生成的文件会被放在 dist 目录
        entryFileNames: `[name].js`,q
        chunkFileNames: `chunks/[name].[hash].js`,
        assetFileNames: `assets/[name].[ext]`,
        // Vite 6 中，代码分割配置移到这里
        inlineDynamicImports: false,
        experimentalMinChunkSize: 10000,
        chunkSizeWarningLimit: 1000,
      },
      // 确保动态导入能够正常工作
      optimizeDeps: {
        include: ['react', 'react-dom']
      },
      base: 'https://your-cdn-domain.com/assistant/',

      // // 配置代码分割
      // manualChunks(id) {
      //   // 将 node_modules 的依赖分割成单独的 chunk
      //   if (id.includes('node_modules')) {
      //     // 将常用库单独打包
      //     if (id.includes('react/')) {
      //       return 'vendor-react';
      //     }
      //     if (id.includes('@tanstack/')) {
      //       return 'vendor-tanstack';
      //     }
      //     // 其他 node_modules 依赖
      //     return 'vendor';
      //   }
      //   // 将特定功能模块打包在一起
      //   if (id.includes('/components/assisant/')) {
      //     return 'assistant';
      //   }
      // }
    }
  }
});
