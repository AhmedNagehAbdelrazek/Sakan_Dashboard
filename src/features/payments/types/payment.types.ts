export type PaymentStatus = "pending" | "received" | "released" | "refunded";

export interface Payment {
  id: string;
  applicationId?: string;
  studentId?: string;
  landlordId?: string;
  status: PaymentStatus;
  amount?: number;
  currency?: string;
  method?: string;
  createdAt?: string;
  updatedAt?: string;
  receivedAt?: string;
  receivedBy?: string;
  releasedAt?: string;
  releasedBy?: string;
  refundReason?: string;
  refundedAt?: string;
}

export interface RefundPaymentInput {
  reason: string;
}
