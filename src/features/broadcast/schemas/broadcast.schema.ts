import { z } from "zod";

export const broadcastSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
  type: z.string().optional(),
});

export type BroadcastSchema = z.infer<typeof broadcastSchema>;
