export interface Activity {
  id: string;
  userId?: string;
  activityType?: string;
  activityDetails?: Record<string, unknown>;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  User?: {
    username?: string;
    email?: string;
    role?: string;
  };
}
