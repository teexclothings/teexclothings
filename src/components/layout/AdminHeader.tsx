"use client";


import { Menu, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function AdminHeader({ onMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { profile } = useAuth();

  // Generate dynamic path breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const label = part.replace("-", " ");
      return (
        <span
          key={part}
          className="flex items-center text-[10px] font-light tracking-widest uppercase text-neutral-500"
        >
          {index > 0 && <span className="mx-2 text-neutral-700">/</span>}
          <span className={index === parts.length - 1 ? "text-neutral-300" : ""}>{label}</span>
        </span>
      );
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-neutral-850 bg-neutral-950 px-6 select-none">
      <div className="flex items-center space-x-4">
        {/* Mobile sidebar button */}
        <button
          onClick={onMenuOpen}
          className="text-neutral-400 hover:text-white lg:hidden focus:outline-none cursor-pointer"
        >
          <Menu size={18} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden sm:flex items-center space-x-1">{getBreadcrumbs()}</div>
      </div>

      {/* Profile summary */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-white">
            {profile?.full_name || "Administrator"}
          </div>
          <div className="text-[8px] font-light tracking-widest uppercase text-neutral-500">
            {profile?.role || "Admin"}
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm border border-neutral-700 bg-neutral-800 text-xs text-white">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <User size={12} />
          )}
        </div>
      </div>
    </header>
  );
}
