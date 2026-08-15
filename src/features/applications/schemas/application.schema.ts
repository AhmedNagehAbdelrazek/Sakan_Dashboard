import { z } from "zod";

export const rejectReasonCategoryEnum = z.enum([
  "not_available",
  "not_interested",
  "payment_issue",
  "documents_missing",
  "other",
]);

export const rejectApplicationSchema = z.object({
  reasonCategory: rejectReasonCategoryEnum,
  detail: z.string().optional(),
});

export type RejectApplicationSchema = z.infer<typeof rejectApplicationSchema>;
