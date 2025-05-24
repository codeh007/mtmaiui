import { cookieAccessToken } from "mtmaiapi";
import { newGraphSseResponse } from "mtxuilib/agentutils/graph_utils";
import { cookies } from "next/headers";
export const runtime = "edge";

/**
 * 获取 graph 状态
 * @param r
 * @returns
 */
const handler = async (r: Request) => {
  const uri = new URL(r.url);
  const threadId = uri.searchParams.get("threadId");
  console.log("");
  try {
    const accessToken = (await cookies()).get(cookieAccessToken)?.value;
    return newGraphSseResponse("opencanvas", await r.json(), {
      configurable: {
        gomtmApiUrl: process.env.MTMAI_BACKEND,
        accessToken: accessToken,
      },
    });
  } catch (e) {
    console.log("run langgraph error", e);
    return new Response(JSON.stringify(e));
  }
};

export const GET = handler;
export const POST = handler;
