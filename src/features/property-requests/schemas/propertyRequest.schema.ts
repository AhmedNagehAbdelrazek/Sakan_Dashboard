import { z } from "zod";

export const propertyRequestTransitionSchema = z.object({
  status: z.enum(["contacted", "resolved", "closed"]),
});

export type PropertyRequestTransitionSchema = z.infer<
  typeof propertyRequestTransitionSchema
>;
