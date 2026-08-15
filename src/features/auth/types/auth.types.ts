export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  countryCode?: string | null;
  role: string;
  verified?: boolean;
  active?: boolean;
}

export interface AuthResponse {
  user: User;
}

export interface AdminLoginResponse {
  user: User;
  role: string;
  token: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
