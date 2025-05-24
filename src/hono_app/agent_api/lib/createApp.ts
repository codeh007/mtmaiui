import { OpenAPIHono } from "@hono/zod-openapi";
import type { StatusCode } from "hono/utils/http-status";
import type { Bindings } from "./types";
export function createRouter() {
  return new OpenAPIHono<{ Bindings: Bindings }>({ strict: false });
}
export default function createApp() {
  const app = new OpenAPIHono<{ Bindings: Bindings }>({ strict: false });

  app.notFound((c) => {
    return c.json(
      {
        message: `Not Found - ${c.req.path}`,
      },
      404,
    );
  });

  app.onError((err, c) => {
    const currentStatus = "status" in err ? err.status : c.newResponse(null).status;
    const statusCode = currentStatus !== "OK" ? (currentStatus as StatusCode) : 500;

    // const env = process.env.NODE_ENV;
    return c.json(
      {
        message: err.message,

        // stack: env === "production" ? undefined : err.stack,
      },
      // @ts-expect-error
      statusCode,
    );
  });

  return app;
}
