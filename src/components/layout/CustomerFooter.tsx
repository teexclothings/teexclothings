"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-16 text-neutral-400 select-none">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand block */}
        <div className="space-y-4">
          <Link href="/" className="focus:outline-none block">
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
          <p className="text-[11px] font-light leading-relaxed tracking-wide text-neutral-500">
            Timeless silhouettes designed with ultimate focus on fabric, cut, and quality details.
          </p>
        </div>

        {/* Directory links */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-white">
            Collection
          </h4>
          <ul className="space-y-2 text-[10px] tracking-wider uppercase font-light">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About The Brand
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Store Location
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-white">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-[10px] tracking-wide font-light">
            {settings?.email && (
              <li className="flex items-center space-x-2">
                <Mail size={12} className="text-neutral-500" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.phone && (
              <li className="flex items-center space-x-2">
                <Phone size={12} className="text-neutral-500" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start space-x-2 leading-relaxed">
                <MapPin size={12} className="text-neutral-500 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Connect channels */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-widest font-semibold text-white">
            Connect
          </h4>
          <div className="flex space-x-3 text-neutral-500">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors p-1"
                aria-label="Instagram Link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors p-1"
                aria-label="Facebook Link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 border-t border-neutral-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-widest uppercase text-neutral-600 font-light">
        <span>
          © {new Date().getFullYear()} {settings?.shop_name || "TEEX CLOTHINGS"}. ALL RIGHTS
          RESERVED.
        </span>
        <span>Minimalist Luxury Fashion</span>
      </div>
    </footer>
  );
}
