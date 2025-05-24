
export type Theme = "dark" | "light";

// declare global {
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    MTX_CACHE_DISABLED: string;
    MTX_CACHE_DEFAULT_SECONDS: string;
    GITHUB_APP_TOKEN: string;
    GITHUB_APP_ID: string;
    GITHUB_APP_PRIVATE_KEY: string;
    GITHUB_ID: string; //GITHUB_APP_CLIENT_ID
    GITHUB_SECRET: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    MTXP2P_BACKEND_URL: string;
    MT_APP_ID: string;
    MTM_SITE_ID: string;
    NEXTAUTH_SECRET: string;
    FACEBOOK_ID: string;
    FACEBOOK_SECRET: string;
    TWITTER_ID: string;
    TWITTER_SECRET: string;
    GOOGLE_APP_ID: string;
    GOOGLE_APP_SECRET: string;
    AUTH0_ID: string;
    // AUTH0_SECRET: string;
    NEXT_PUBLIC_SANITY_DATASET: string;
    NEXT_PUBLIC_SANITY_PROJECT_ID: string;
    // NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
    VOLUMES_DIR: string;
    //基于go的微服务后端网址(对于动态类型数据调用， 还应该直接使用http api的方式调用比较合适，原生的grpc，太复杂了。)
    // MSERVICE_URL: string;
    NEXT_PUBLIC_MTMAPI_URL: string;
    NEXT_PUBLIC_MTMAPI_GRPC_URL: string;
    MTMAPI_URL: string;
    MTMAPI_SITE_TOKEN: string;
    //重型UI网址
    NEXT_PUBLIC_XUI_URL: string;
    //chatgpt 相关
    OPENAI_API_KEY?: string;
    CODE?: string;
    BASE_URL?: string;
    PROXY_URL?: string;
    VERCEL?: "1";
    HIDE_USER_API_KEY?: string; // disable user's api key input
    DISABLE_GPT4?: string; // allow user to use gpt-4 or not
    BUILD_MODE?: "standalone" | "export";
    BUILD_APP?: string; // is building desktop app
    HIDE_BALANCE_QUERY?: string; // allow user to query balance or not
    KV100: KVNamespace;
    MTM_HOSTNAME?: string;
    MTM_BACKEND: string;

    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_API_EMAIL: string;
    CLOUDFLARE_API_TOKEN: string;
  }
}
