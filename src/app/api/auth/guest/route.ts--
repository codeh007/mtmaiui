import { isDevelopmentEnvironment } from "@mtmaiui/aichatbot/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { signIn } from "../../../../lib/auth/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
