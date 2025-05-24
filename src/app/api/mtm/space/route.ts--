import type { EndpointList } from "mtmaiapi";
import { copyIncomeHeaders } from "mtxuilib/http/rproxy";

// export const runtime = "edge";

/**
 * 业务api 反向代理
 */
const handler = async (r: Request) => {
  let userName = "";
  try {
    let endpointList: EndpointList | undefined = undefined;
    // endpointList = await getEndpointList();

    if (!endpointList?.rows?.length) {
      // console.log(`使用环境变量的默认值:${process.env.DEFAULT_HFSPACE}`);
      const uri = new URL(process.env.DEFAULT_HFSPACE!);
      userName = uri.username;
      const cleanUrl = `${uri.protocol}//${uri.host}${uri.pathname}${uri.search}`;
      endpointList = {
        rows: [],
      };
      endpointList?.rows?.push({
        url: cleanUrl,
        token: uri.password,
        metadata: {
          id: "default-hfspace",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        name: "default-hfspace",
        type: "hfspace",
      });
      console.log(`endpointList:${JSON.stringify(endpointList)}`);
    }
    //开发阶段使用第一条配置作为远程服务器的配置
    const targetEndpoint = endpointList?.rows?.[0];
    console.log(`targetEndpoint:${JSON.stringify(targetEndpoint)}`);
    const remoteUrl = `https://${userName}-${userName}.hf.space/api/v1/agent/hello/ag`;
    const token = targetEndpoint!.token;

    const requestHeaders = copyIncomeHeaders(r);
    for (const [key, value] of requestHeaders.entries()) {
      console.log(`header:${key}:${value}`);
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);

    const response = await fetch(remoteUrl.toString(), {
      method: r.method,
      headers: requestHeaders,
      body: r.body,
    });

    console.log(`🚀 [rroxy(space)] => ${r.method} ${response.status} ${remoteUrl.toString()}\n`);
    return response;
  } catch (e) {
    return new Response(
      JSON.stringify(
        {
          error: (e as Error).message,
          stack: (e as Error).stack,
          name: (e as Error).name,
          cause: (e as Error).cause,
          // Omit cause and details to avoid circular JSON structure
        },
        // Use a replacer function to handle circular references
        (key, value) => {
          if (key === "cause" || key === "issuerCertificate") {
            return "[Circular]";
          }
          return value;
        },
        2,
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
