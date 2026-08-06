"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/context/ToastContext";
import AdminLayoutWrapper from "@/components/layout/AdminLayoutWrapper";

export default function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </ToastProvider>
  );
}
