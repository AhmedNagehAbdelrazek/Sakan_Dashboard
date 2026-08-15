import { z } from "zod";

export const refundPaymentSchema = z.object({
  reason: z.string().min(1),
});

export type RefundPaymentSchema = z.infer<typeof refundPaymentSchema>;
