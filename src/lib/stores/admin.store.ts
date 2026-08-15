import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  countryCode?: string | null;
  role: string;
  verified?: boolean;
}

type AdminAuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AdminState {
  adminUser: AdminUser | null;
  status: AdminAuthStatus;
  sidebarCollapsed: boolean;
  activePath: string;
  login: (user: AdminUser) => void;
  logout: () => void;
  setStatus: (status: AdminAuthStatus) => void;
  toggleSidebar: () => void;
  setActivePath: (path: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminUser: null,
      status: "idle",
      sidebarCollapsed: false,
      activePath: "/admin",
      login: (user) => set({ adminUser: user, status: "authenticated" }),
      logout: () => set({ adminUser: null, status: "unauthenticated" }),
      setStatus: (status) => set({ status }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setActivePath: (path) => set({ activePath: path }),
    }),
    {
      name: "admin-sidebar",
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
);
