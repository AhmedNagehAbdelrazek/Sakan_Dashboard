export type PaymentStatus = "pending" | "received" | "released" | "refunded";

export interface Payment {
  id: string;
  applicationId?: string;
  studentId?: string;
  landlordId?: string;
  application?: {
    id?: string;
  };
  student?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
  };
  landlord?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
  };
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
