import { z } from "zod";

export const userRoleEnum = z.enum([
  "student",
  "landlord",
  "admin",
  "super_admin",
  "manager",
]);

export const updateUserSchema = z.object({
  role: userRoleEnum.optional(),
  verified: z.boolean().optional(),
  active: z.boolean().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
