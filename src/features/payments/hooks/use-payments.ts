"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import type { RefundPaymentInput } from "../types/payment.types";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentService.listPayments(),
    retry: 1,
  });
}

export function usePaymentActions() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["payments"] });

  const receive = useMutation({
    mutationFn: (id: string) => paymentService.receivePayment(id),
    onSuccess: invalidate,
  });

  const release = useMutation({
    mutationFn: (id: string) => paymentService.releasePayment(id),
    onSuccess: invalidate,
  });

  const refund = useMutation({
    mutationFn: ({ id, input }: { id: string; input: RefundPaymentInput }) =>
      paymentService.refundPayment(id, input),
    onSuccess: invalidate,
  });

  return { receive, release, refund };
}
