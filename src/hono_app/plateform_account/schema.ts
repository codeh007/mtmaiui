import { z } from "@hono/zod-openapi";

export const PlateformAccountInsertSchema = z
  .object({
    name: z.string().openapi({
      example: "John Doe",
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi("PlateformAccountInsert");

export const PlateformAccountSelectSchema = z
  .object({
    id: z.string().openapi({
      example: "123",
    }),
    name: z.string().openapi({
      example: "John Doe",
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi("UserSelect");

// export const patchUserSchema = UserInsertSchema.partial();
