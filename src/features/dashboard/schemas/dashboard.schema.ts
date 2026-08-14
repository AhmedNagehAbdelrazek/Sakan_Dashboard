import { z } from "zod";

export const apiEnvelopeSchema = z.object({
  status: z.enum(["success", "error"]),
  data: z.unknown().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  message: z.string().optional(),
});
