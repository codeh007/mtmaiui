import { skipCSRFCheck } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import type { OpenAPIHono } from "@hono/zod-openapi";
// import Instagram from "next-auth/providers/instagram";
import Twitter from "next-auth/providers/twitter";
import type { Bindings } from "./types";

//文档: https://github.com/honojs/middleware/tree/main/packages/auth-js
export default function configureAuth(app: OpenAPIHono<{ Bindings: Bindings }>) {
  app.use(
    "*",
    initAuthConfig((c) => ({
      /**
       * authjs 问题排查:
       *    1: 必须设置 AUTH_SECRET 及 AUTH_URL 变量
       */
      secret: process.env.AUTH_SECRET,
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Twitter({
          clientId: process.env.TWITTER_CLIENT_ID,
          clientSecret: process.env.TWITTER_CLIENT_SECRET,
        }),
        // Instagram({
        //   clientId: c.env.INSTAGRAM_CLIENT_ID,
        //   clientSecret: c.env.INSTAGRAM_CLIENT_SECRET,
        // }),
      ],
      // adapter: D1Adapter(c.env.DB),
      debug: true,
      skipCSRFCheck: skipCSRFCheck,
      basePath: "/api/auth",
      callbacks: {
        signIn: async ({ user }) => {
          console.log("signIn", user);
          return true;
        },
      },
    })),
  );

  app.use("/api/auth/*", authHandler());

  // 需要认证的 api
  app.use("/api/*", verifyAuth());
  // 需要认证的 agents
  // app.use("/agents/*", verifyAuth());

  app.get("/api/protected", (c) => {
    // 演示
    const auth = c.get("authUser");
    return c.json(auth);
  });
}
