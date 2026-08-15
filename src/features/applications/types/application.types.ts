export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export type RejectReasonCategory =
  | "not_available"
  | "not_interested"
  | "payment_issue"
  | "documents_missing"
  | "other";

export interface Application {
  id: string;
  userId?: string;
  propertyId?: string;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationDetail extends Application {
  Property?: {
    id: string;
    title?: string;
    state?: string;
  };
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
