const mode = process.env.BUILD_MODE ?? "standalone";
const disableChunk = !!process.env.DISABLE_CHUNK || mode === "export";
const distDir = process.env.NEXT_BUILD_OUTPUT ?? ".next";
console.log(`nextjs (mtxedge)===================================
mode : ${mode} output: ${distDir} disableChunk ${disableChunk}`);
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 提示： 当 reactStrictMode 为 true，组件会渲染两次。
  //       见文档：https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
  reactStrictMode: false,
  transpilePackages: ["mtmaiapi", "mtmaiui"],
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  distDir: distDir, //输出路径
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // add externals
    config.externals = config.externals || [];
    config.externals.push(
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
      "puppeteer-extra-plugin-adblocker",
      "puppeteer-extra-plugin-block-resources",
      "puppeteer-extra-plugin-devtools",
      "puppeteer-extra-plugin-stealth",
      "puppeteer-extra-plugin-recaptcha",
      "puppeteer-extra-plugin-session",
      "@puppeteer",
      "turndown",
      "linkedom",
      "cloudflare:sockets",
      "cloudflare",
      "onnxruntime-node",
      "cosmiconfig",
      "inngest",
      "canvas",
      "onnxruntime-node",
      "@xenova",
      "tiktoken",
      "unpdf",
      "agent-base",
      "basic-ftp",
    );
    return config;
  },

  serverExternalPackages: [
    "@prisma/client",
    "clone-deep",
    "puppeteer-core",
    "puppeteer",
    "merge-deep",
    "puppeteer-extra",
    "puppeteer-extra-plugin-stealth",
    "puppeteer-extra-plugin-recaptcha",
    "cross-fetch",
    "node-fetch",
    "puppeteer-extra-plugin-devtools",
    "puppeteer-extra-plugin-stealth",
    "puppeteer-extra-plugin-session",
    "@puppeteer",
    "turndown",
    "linkedom",
    "cloudflare:sockets",
    "cloudflare",
    "cosmiconfig",
    "inngest",
    "llamaindex",
    "onnxruntime-node",
    "canvas",
    "@xenova",
    "tiktoken",
    "unpdf",
    "agent-base",
    "basic-ftp",
  ],
};

export default nextConfig;
