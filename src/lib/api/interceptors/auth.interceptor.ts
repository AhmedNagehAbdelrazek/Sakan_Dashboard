import type { AxiosInstance } from "axios";
import { tokenHolder } from "../token";

export function setupAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    config.withCredentials = true;

    const token = tokenHolder.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}
