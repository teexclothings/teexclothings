"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchModal from "@/components/ui/SearchModal";

interface HeaderProps {
  settings: {
    shop_name: string;
    logo: string | null;
  } | null;
}

export default function CustomerHeader({ settings }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "SHOP", path: "/products" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  const isScrolled = mounted && scrolled;

  return (
    <header
      suppressHydrationWarning
      className={`sticky top-0 z-45 w-full bg-white dark:bg-black transition-all duration-200 select-none border-b border-neutral-200 dark:border-neutral-850 ${
        isScrolled ? "py-3 shadow-xs" : "py-4.5"
      }`}
    >
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="focus:outline-none flex items-center">
          {settings?.logo ? (
            <img
              src={settings.logo}
              alt={settings.shop_name}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <span className="font-extrabold text-xl tracking-[0.2em] text-black dark:text-white uppercase font-sans">
              TEEX
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const active =
              pathname === link.path ||
              (link.path === "/products" && pathname.startsWith("/products"));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-1 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors ${
                  active ? "text-black dark:text-white font-bold" : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black dark:bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-5 text-black dark:text-white">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-1.5 focus:outline-none cursor-pointer text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Search Catalog"
          >
            <Search size={17} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="p-1.5 focus:outline-none cursor-pointer text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag size={17} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1 md:hidden focus:outline-none cursor-pointer text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-55 w-72 max-w-[80vw] bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-850 p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4">
            <Link href="/" onClick={handleLinkClick} className="focus:outline-none">
              <span className="font-extrabold text-lg tracking-[0.2em] text-black dark:text-white uppercase font-sans">
                TEEX
              </span>
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 text-neutral-500 hover:text-black dark:hover:text-white focus:outline-none cursor-pointer"
              aria-label="Close Menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col space-y-5">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={handleLinkClick}
                  className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                    active ? "text-black dark:text-white font-bold" : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6 text-[9px] tracking-widest uppercase text-neutral-400 font-light">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings?.shop_name || "TEEX CLOTHINGS"}.
        </div>
      </div>
    </header>
  );
}
