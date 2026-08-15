export type PropertyState = "sent" | "approved" | "declined";

export interface Property {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  pricePerMonth?: string | number;
  currency?: string;
  totalRooms?: number;
  availableRooms?: number;
  type?: string;
  address?: string;
  amenities?: Record<string, boolean>;
  userId?: string;
  isActive?: boolean;
  state: PropertyState;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyActionResult {
  message: string;
  property?: { id: string; state: PropertyState };
}
