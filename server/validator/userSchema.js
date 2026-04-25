import z from "zod/v4";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const loginSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});
