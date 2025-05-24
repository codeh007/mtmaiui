"use client";

import { useQuery } from "@tanstack/react-query";

export const useListSiteHosts = (siteId: string) => {
  return useQuery({
    queryKey: ["listSiteHosts", siteId],
    queryFn: async () => {
      const res = await fetch(`/api/site/hosts?siteId=${siteId}`);
      return res.json();
    },
  });
};
