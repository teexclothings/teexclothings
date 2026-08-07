"use client";


import Link from "next/link";
import {
  ShoppingBag,
  FolderTree,
  Image as ImageIcon,
  Truck,
  Settings,
  User,
  ArrowRight,
} from "lucide-react";

const SHORTCUTS = [
  {
    href: "/admin/products",
    label: "Products",
    desc: "Manage catalog products, pricing, sizes, and colors.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    desc: "Organize collections, display names, and unique slugs.",
    icon: FolderTree,
  },
  {
    href: "/admin/hero-banners",
    label: "Hero Banners",
    desc: "Configure media carousels and loop videos.",
    icon: ImageIcon,
  },
  {
    href: "/admin/shipping",
    label: "Shipping Rates",
    desc: "Set state delivery flat charges dynamically.",
    icon: Truck,
  },
  {
    href: "/admin/settings",
    label: "Shop Settings",
    desc: "Manage address, contact numbers, and social links.",
    icon: Settings,
  },
  {
    href: "/admin/profile",
    label: "Admin Profile",
    desc: "Update account details and sign-in keys.",
    icon: User,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 select-none">
      <div className="border-b border-neutral-200 dark:border-neutral-850 pb-6">
        <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
          Overview Console
        </span>
        <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
          TEEX Control Desk
        </h1>
        <p className="mt-2 text-xs font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
          Select a quick link below to update content, upload banners, edit categories, or adjust
          shipping rates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex flex-col justify-between border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 rounded-sm transition-all hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 transition-colors group-hover:border-black dark:hover:border-white group-hover:text-black dark:text-white rounded-sm">
                  <Icon size={14} />
                </div>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-widest text-black dark:text-white">
                  {item.label}
                </h3>
                <p className="mt-2 text-xs font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-[9px] uppercase tracking-widest text-neutral-500 transition-colors group-hover:text-black dark:text-white">
                <span>Manage</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
