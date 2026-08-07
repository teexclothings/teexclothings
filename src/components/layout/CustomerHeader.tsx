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
          <img
            src="/images/logo.png"
            alt={settings?.shop_name || "TEEX Clothings"}
            className="h-8 sm:h-10 md:h-11 w-auto max-w-[160px] sm:max-w-[200px] object-contain dark:invert"
          />
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
        <div className="flex items-center space-x-3 sm:space-x-5 text-black dark:text-white">
          {/* Desktop-only Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Search Button (Mobile & Desktop) */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-1.5 focus:outline-none cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Search Catalog"
          >
            <Search size={19} strokeWidth={2} />
          </button>

          {/* Desktop-only Shopping Bag Button */}
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="hidden md:block p-1.5 focus:outline-none cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag size={18} strokeWidth={2} />
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1 md:hidden focus:outline-none cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors ml-1"
            aria-label="Open Menu"
          >
            <Menu size={22} strokeWidth={2} />
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

        {/* Mobile Drawer Footer Actions (Shopping Bag & Theme Toggle) */}
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-5 space-y-4">
          <div className="flex items-center justify-between py-1">
            <Link
              href="/products"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            >
              <ShoppingBag size={18} />
              <span>SHOPPING BAG</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">THEME</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="text-[9px] tracking-widest uppercase text-neutral-400 font-light pt-2 border-t border-neutral-100/60 dark:border-neutral-900/60">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings?.shop_name || "TEEX CLOTHINGS"}.
          </div>
        </div>
      </div>
    </header>
  );
}
