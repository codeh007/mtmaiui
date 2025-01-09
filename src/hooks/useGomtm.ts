"use client";
import { createClient, createConfig } from "@hey-api/client-fetch";
import { useMemo } from "react";
export function useGomtmClient() {
  const c = useMemo(() => {
    const client = createClient(createConfig());

    client.setConfig({
      baseUrl: "https://colab-gomtm.yuepa8.com",
      fetch: (req) => {
        return fetch(req, {
          //允许跨站cookie，这样可以不用专门设置 Authorization header
          credentials: "include",
        });
      },
    });
    return client;
  }, []);

  return c;
}
