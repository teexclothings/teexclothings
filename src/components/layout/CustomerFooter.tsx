"use client";

import Link from "next/link";

interface FooterProps {
  settings: {
    shop_name: string;
    logo: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    address: string | null;
  } | null;
}

export default function CustomerFooter({ settings }: FooterProps) {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-950/40 py-14 text-neutral-600 dark:text-neutral-400 select-none">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand block */}
        <div className="space-y-4">
          <Link href="/" className="focus:outline-none block">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings.shop_name}
                className="h-6 w-auto object-contain"
              />
            ) : (
              <span className="font-extrabold text-xl tracking-[0.2em] text-black dark:text-white uppercase font-sans">
                {settings?.shop_name || "TEEX"}
              </span>
            )}
          </Link>
          <p className="text-xs font-light leading-relaxed tracking-wide text-neutral-500 dark:text-neutral-400 max-w-xs">
            Minimal streetwear crafted for everyday wear. Made with premium quality and attention to detail.
          </p>
          <div className="flex space-x-3 text-black dark:text-white pt-1">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-75 transition-opacity p-1 bg-neutral-200/60 dark:bg-neutral-800 rounded-full"
                aria-label="Instagram Link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-75 transition-opacity p-1 bg-neutral-200/60 dark:bg-neutral-800 rounded-full"
                aria-label="WhatsApp Link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Directory links - SHOP */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            SHOP
          </h4>
          <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium">
            <li>
              <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/products?category=graphic-tees" className="hover:text-black dark:hover:text-white transition-colors">
                Graphic Tees
              </Link>
            </li>
            <li>
              <Link href="/products?category=oversized" className="hover:text-black dark:hover:text-white transition-colors">
                Oversized
              </Link>
            </li>
            <li>
              <Link href="/products?category=striped-tees" className="hover:text-black dark:hover:text-white transition-colors">
                Striped Tees
              </Link>
            </li>
            <li>
              <Link href="/products?category=plain-tees" className="hover:text-black dark:hover:text-white transition-colors">
                Plain Tees
              </Link>
            </li>
          </ul>
        </div>

        {/* Directory links - COMPANY */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            COMPANY
          </h4>
          <ul className="space-y-2 text-[11px] tracking-wider uppercase font-medium">
            <li>
              <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-black dark:hover:text-white transition-colors">
                Shipping Info
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-black dark:hover:text-white transition-colors">
                Returns & Exchange
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            CONTACT
          </h4>
          <ul className="space-y-2 text-[11px] tracking-wider font-medium text-neutral-600 dark:text-neutral-400">
            <li>WhatsApp</li>
            <li className="font-semibold text-black dark:text-white">
              {settings?.whatsapp || settings?.phone || "+91 (98765) 43210"}
            </li>
            <li className="pt-1">Instagram</li>
            <li className="font-semibold text-black dark:text-white">@_teex</li>
            <li className="pt-1">Email</li>
            <li className="font-semibold text-black dark:text-white">{settings?.email || "teexclothings@gmail.com"}</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 border-t border-neutral-200 dark:border-neutral-850 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-medium">
        <span>
          © {new Date().getFullYear()} {settings?.shop_name || "TEEX"}. All rights reserved.
        </span>
        <span className="flex items-center gap-1">
          Designed with passion. <span className="text-red-500">❤️</span>
        </span>
      </div>
    </footer>
  );
}
