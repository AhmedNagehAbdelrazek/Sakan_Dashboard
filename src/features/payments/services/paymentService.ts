import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type { Payment, RefundPaymentInput } from "../types/payment.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const paymentService = {
  listPayments: async (): Promise<NormalizedList<Payment>> => {
    const response = await fetch("/api/payments");
    const data = await unwrap<unknown>(response);
    return normalizeList<Payment>(data);
  },

  receivePayment: async (id: string): Promise<Payment> => {
    const response = await fetch(`/api/payments/${id}/receive`, { method: "PATCH" });
    return unwrap<Payment>(response);
  },

  releasePayment: async (id: string): Promise<Payment> => {
    const response = await fetch(`/api/payments/${id}/release`, { method: "PATCH" });
    return unwrap<Payment>(response);
  },

  refundPayment: async (id: string, input: RefundPaymentInput): Promise<Payment> => {
    const response = await fetch(`/api/payments/${id}/refund`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return unwrap<Payment>(response);
  },
};
