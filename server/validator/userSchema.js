import z from "zod/v4";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});
