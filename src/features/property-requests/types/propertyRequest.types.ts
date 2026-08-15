export type PropertyRequestStatus = "pending" | "contacted" | "resolved" | "closed";

export interface PropertyRequest {
  id: string;
  userId?: string;
  message?: string;
  propertyType?: string;
  requestType?: string;
  address?: string;
  major?: string;
  status: PropertyRequestStatus;
  createdAt?: string;
  updatedAt?: string;
}
