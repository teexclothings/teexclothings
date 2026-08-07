"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Image as ImageIcon,
  Truck,
  Settings,
  User,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/hero-banners", label: "Hero Banners", icon: ImageIcon },
  { href: "/admin/shipping", label: "Shipping Rates", icon: Truck },
  { href: "/admin/settings", label: "Shop Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminSidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logoutAction();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-850 text-neutral-800 dark:text-white p-6 justify-between select-none">
      <div className="space-y-8">
        <div>
          <img
            src="/images/logo.png"
            alt="TEEX Logo"
            className="h-8 sm:h-10 w-auto object-contain dark:invert"
          />
          <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase mt-1">
            Management Console
          </p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest transition-colors rounded-sm ${
                  active
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                    : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-850/50"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-450 transition-colors rounded-sm focus:outline-none cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-20">{content}</aside>

      {/* Mobile Drawer (Sliding Overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-neutral-50 dark:bg-neutral-900 h-full animate-fade-in">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors z-55 text-sm cursor-pointer"
            >
              ✕
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
