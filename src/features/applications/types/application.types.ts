export type ApplicationStatus = "pending" | "approved" | "rejected" | "completed";

export type RejectReasonCategory =
  | "not_available"
  | "not_interested"
  | "payment_issue"
  | "documents_missing"
  | "other";

export interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
  };
  property?: {
    id?: string;
    title?: string;
    state?: string;
  };
}

export interface ApplicationDetail extends Application {
  approvedBy?: string;
  approvedAt?: string;
  approvalExpiresAt?: string;
  completedAt?: string;
  message?: string;
}

export interface RejectApplicationInput {
  reasonCategory: RejectReasonCategory;
  detail?: string;
}
