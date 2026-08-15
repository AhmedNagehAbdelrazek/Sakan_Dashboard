export type UserRole =
  | "student"
  | "landlord"
  | "admin"
  | "super_admin"
  | "manager";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  countryCode?: string | null;
  role: UserRole;
  verified?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserInput {
  role?: UserRole;
  verified?: boolean;
  active?: boolean;
}
