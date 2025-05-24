import { getBackendUrl, initGomtmApp } from "mtmaiapi/gomtmapp";
import { newRProxy } from "mtxuilib/http/rproxy";

// export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  await initGomtmApp({ r: r });
  const rProxy = newRProxy({
    rewrites: [
      {
        from: "/api/v1/tenants/:tenant/chat",
        to: "http://localhost:7860/api/v1/tenants/:tenant/chat",
      },
      {
        from: "/api/v1/(.*)",
        to: `${getBackendUrl()}/api/v1/$1`,
      },
    ],
  });
  return rProxy(r);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
export const HEAD = handler;
