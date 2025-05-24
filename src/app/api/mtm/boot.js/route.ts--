import { getBackendUrl } from "mtxuilib/lib/sslib";
import { headers } from "next/headers";

// export const runtime = "edge";

const mtmaibot_access_token = "mtmaibot_access_token";
// 返回 mtmai copilot 的 js 引导脚本文件
const handler = async (r: Request) => {
  const mtmai_backend = process.env.MTMAI_API_BASE || "";
  if (!mtmai_backend) {
    return new Response("mtmai_backend not set", {
      status: 500,
    });
  }
  const selfBackendUrl = getBackendUrl();

  const incomeAccessToken = headers().get(mtmaibot_access_token) || "";
  const config: IMtmaiBootstrapConfig = {
    mtmai_backends: [mtmai_backend],
    mtmai_access_token: incomeAccessToken,
  };
  //主脚本url
  const externalScriptUrl = `${selfBackendUrl}/mtmaibot.js`;
  const bootScript = `
  window.mtmaiBootstrapConfig = ${JSON.stringify(config)};
  console.log('hello world mtmai copilot')
  const script = document.createElement('script');
  script.src = "${externalScriptUrl}";
  script.async = true;
  document.head.appendChild(script);

`;
  return new Response(bootScript, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
};

export const GET = handler;
