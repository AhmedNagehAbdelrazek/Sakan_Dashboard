"use client";

import type { ReactNode } from "react";
import { useAdminStore } from "@/lib/stores/admin.store";
import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const status = useAdminStore((state) => state.status);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen">
        <div className="bg-muted w-64 animate-pulse" />
        <div className="flex flex-1 flex-col">
          <div className="bg-muted h-16 animate-pulse border-b" />
          <div className="bg-muted/50 flex-1 animate-pulse p-6">
            <div className="bg-muted-foreground/20 h-8 w-48 rounded" />
            <div className="bg-muted-foreground/10 mt-4 h-64 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopBar />
        <main id="main-content" className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
