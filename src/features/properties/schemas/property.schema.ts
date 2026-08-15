import { z } from "zod";

export const declinePropertySchema = z.object({
  reason: z.string().max(500).optional(),
});

export type DeclinePropertySchema = z.infer<typeof declinePropertySchema>;
