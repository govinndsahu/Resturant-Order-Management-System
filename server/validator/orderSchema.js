import z from "zod/v4";

export const createOrderSchema = z.object({
  products: z.array(z.any()),
  tableNumber: z.number(),
  buyer: z.string().default(""),
  total: z.number(),
});
