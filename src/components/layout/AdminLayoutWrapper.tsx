"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main offset pane */}
      <div className="flex flex-col lg:pl-64 min-h-screen">
        {/* Top sticky header */}
        <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />

        {/* Dynamic page content */}
        <main className="flex-1 bg-background p-6 sm:p-8">
          <div className="mx-auto w-full max-w-5xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
