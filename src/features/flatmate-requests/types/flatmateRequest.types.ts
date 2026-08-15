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
  };
  createdAt?: string;
  updatedAt?: string;
}
