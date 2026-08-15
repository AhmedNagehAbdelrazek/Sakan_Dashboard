export type PropertyRequestStatus = "pending" | "contacted" | "resolved" | "closed";

export interface PropertyRequest {
  id: string;
  userId?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
  };
  message?: string;
  propertyType?: string;
  requestType?: string;
  address?: string;
  major?: string;
  status: PropertyRequestStatus;
  createdAt?: string;
  updatedAt?: string;
}
