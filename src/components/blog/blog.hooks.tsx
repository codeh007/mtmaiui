"use client";

import { useMtmClient, useTenant } from "../../hooks";

export function useBlog(blogId: string) {
  const mtmapi = useMtmClient();
  const tenant = useTenant();
  const blogQuery = mtmapi.useSuspenseQuery(
    "get",
    "/api/v1/tenants/{tenant}/blogs/{blog}",
    {
      params: {
        path: {
          tenant: tenant.metadata.id,
          blog: blogId,
        },
      },
    },
    {
      // refetchInterval: 5000,
    },
  );
  return blogQuery;
}
