"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {  useTenantId } from "../../hooks/useAuth";
import { blogGetOptions } from "mtmaiapi";


export function useBlog(blogId: string) {
  const tid = useTenantId();
  const blogQuery = useSuspenseQuery({
    ...blogGetOptions({
        path: {
          tenant: tid,
          blog: blogId,
        },
    })
  });
  return blogQuery;
}
