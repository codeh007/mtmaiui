import { z } from "zod";

const upsertSiteSchema = z.object({
  title: z.string(),
  host: z.string(),
});

export type UpsertSiteSchema = z.infer<typeof upsertSiteSchema>;

const listSitesSchema = z.object({
  data: z.array(z.any()),
});

export type ListSitesType = z.infer<typeof listSitesSchema>;
