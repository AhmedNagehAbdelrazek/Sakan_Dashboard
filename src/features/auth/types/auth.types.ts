export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  user: User;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
