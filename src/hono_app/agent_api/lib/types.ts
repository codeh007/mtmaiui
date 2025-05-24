import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import type { RouteConfig, RouteHandler, z } from "@hono/zod-openapi";

export type Bindings = Env & {
  OAUTH_PROVIDER: OAuthHelpers;
};

export type AppRouteHandler<
  R extends RouteConfig,
  //   Env extends Bindings,
  //   InferRequestType = unknown,
  //   InferResponseType = unknown,
> = RouteHandler<R, { Bindings: Bindings }>;

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
