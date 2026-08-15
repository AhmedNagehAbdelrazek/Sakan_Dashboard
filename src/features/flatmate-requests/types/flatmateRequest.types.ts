export interface FlatmateRequest {
  id: string;
  userId?: string;
  preferredBudget?: number;
  preferredType?: string;
  peopleWanted?: number;
  status?: string;
  joinInterests?: unknown[];
  user?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}
