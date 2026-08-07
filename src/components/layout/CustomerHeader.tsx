"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

interface HeaderProps {
  settings: {
    shop_name: string;
    logo: string | null;
  } | null;
}

export default function CustomerHeader({ settings }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    { name: "Home", path: "/" },
    { name: "Collection", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  const isScrolled = mounted && scrolled;

  return (
    <header
      suppressHydrationWarning
      className={`sticky top-0 z-45 w-full transition-all duration-300 select-none ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-neutral-900 py-3.5"
          : "bg-black/20 py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <Link href="/" className="focus:outline-none">
          {settings?.logo ? (
            <img
              src={settings.logo}
              alt={settings.shop_name}
              className="h-6 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <span className="font-serif-luxury text-lg font-light tracking-[0.25em] text-white uppercase">
              {settings?.shop_name || "TEEX"}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex space-x-10">
          {navLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-white ${
                  active ? "text-white" : "text-neutral-500"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4 text-white">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="p-1 focus:outline-none cursor-pointer text-neutral-400 hover:text-white transition-colors"
            aria-label="Search Catalog"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1 md:hidden focus:outline-none cursor-pointer text-neutral-400 hover:text-white transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-55 w-72 max-w-[80vw] bg-neutral-950 border-r border-neutral-900 p-6 flex flex-col justify-between transition-transform duration-500 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={handleLinkClick} className="focus:outline-none">
              <span className="font-serif-luxury text-base font-light tracking-[0.25em] text-white uppercase">
                {settings?.shop_name || "TEEX"}
              </span>
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 text-neutral-400 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={handleLinkClick}
                  className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${
                    active ? "text-white" : "text-neutral-500 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-neutral-900 pt-6 text-[9px] tracking-widest uppercase text-neutral-600 font-light">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings?.shop_name || "TEEX CLOTHINGS"}.
        </div>
      </div>
    </header>
  );
}
