import { initGomtmApp } from "mtmaiapi/gomtmapp";
import { newRProxy } from "mtxuilib/http/rproxy";
import { createRouter } from "../agent_api/lib/createApp";

const gomtmProxyRouter = createRouter();

gomtmProxyRouter.all("/", async (c) => {
  const r = c.req.raw;
  await initGomtmApp({ r: r });

  // 如果 使用 nextjs 环境，这里不能正常工作, 可能原因是 request/response 对象 在 edge和node环境下 有差异
  const rProxy = newRProxy({
    rewrites: [
      {
        from: "/api/v1/tenants/:tenant/chat",
        to: "http://localhost:7860/api/v1/tenants/:tenant/chat",
      },
      {
        from: "/api/v1/(.*)",
        to: `${process.env.MTMAI_BACKEND}/api/v1/$1`,
      },
      {
        from: "/api/v1/run_sse/(.*)",
        to: "http://localhost:7860/api/v1/run_sse/$1",
      },
    ],
  });
  const response = await rProxy(r);
  return response.clone();
});

export default gomtmProxyRouter;
