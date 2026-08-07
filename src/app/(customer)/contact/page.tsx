import { createClient } from "@/utils/supabase/server";
import { Mail, Phone, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_DISPLAY_PHONE } from "@/utils/constants";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us | TEEX Clothings",
  description: "Get in touch with TEEX Clothings via WhatsApp, Phone, Email, or Instagram. Direct order & customer support lines.",
};

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  const whatsappPhone = settings?.whatsapp || DEFAULT_WHATSAPP_NUMBER;
  const whatsappClean = whatsappPhone.replace(/[^\d]/g, "");
  const displayPhone = settings?.phone || settings?.whatsapp || DEFAULT_WHATSAPP_DISPLAY_PHONE;
  const emailAddr = settings?.email || "teexclothings@gmail.com";
  const instaUrl = settings?.instagram || "https://instagram.com/__teex";
  const addressText = settings?.address || "Vengara, Tharayittal 676304";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-20 space-y-12 select-none">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
          CUSTOMER SUPPORT
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white uppercase">
          GET IN TOUCH
        </h1>
        <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          Reach out to us directly for orders, size assistance, or inquiries. Fast responses guaranteed.
        </p>
      </div>

      {/* Direct Communication Channels Grid (No Form) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 1. WHATSAPP CARD */}
        <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/80 dark:bg-neutral-900/50 p-6 space-y-4 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <h2 className="text-base font-extrabold tracking-wider uppercase text-black dark:text-white pt-1">
              WHATSAPP SUPPORT
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Order directly or chat live with our support team on WhatsApp.
            </p>
            <p className="text-xs font-semibold text-black dark:text-white pt-1">
              +{whatsappClean}
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappClean}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center space-x-2 bg-black text-white dark:bg-white dark:text-black w-full py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-xs"
          >
            <span>CHAT ON WHATSAPP</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* 2. CALL SUPPORT CARD */}
        <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/80 dark:bg-neutral-900/50 p-6 space-y-4 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white flex items-center justify-center">
              <Phone size={18} />
            </div>
            <h2 className="text-base font-extrabold tracking-wider uppercase text-black dark:text-white pt-1">
              PHONE LINE
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Call us directly for urgent order status or shipping queries.
            </p>
            <p className="text-xs font-semibold text-black dark:text-white pt-1">
              {displayPhone}
            </p>
          </div>
          <a
            href={`tel:${displayPhone.replace(/[^\d]/g, "")}`}
            className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white w-full py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-xs"
          >
            <span>CALL NOW</span>
            <Phone size={13} />
          </a>
        </div>

        {/* 3. EMAIL SUPPORT CARD */}
        <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/80 dark:bg-neutral-900/50 p-6 space-y-4 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white flex items-center justify-center">
              <Mail size={18} />
            </div>
            <h2 className="text-base font-extrabold tracking-wider uppercase text-black dark:text-white pt-1">
              EMAIL INQUIRIES
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Send us an email for bulk orders, partnerships, or assistance.
            </p>
            <p className="text-xs font-semibold text-black dark:text-white pt-1">
              {emailAddr}
            </p>
          </div>
          <a
            href={`mailto:${emailAddr}`}
            className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white w-full py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-xs"
          >
            <span>SEND EMAIL</span>
            <Mail size={13} />
          </a>
        </div>

        {/* 4. INSTAGRAM SUPPORT CARD */}
        <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/80 dark:bg-neutral-900/50 p-6 space-y-4 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            </div>
            <h2 className="text-base font-extrabold tracking-wider uppercase text-black dark:text-white pt-1">
              INSTAGRAM DM
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              DM us on Instagram for latest drops, outfit features & support.
            </p>
            <p className="text-xs font-semibold text-black dark:text-white pt-1">
              @__teex
            </p>
          </div>
          <a
            href={instaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center space-x-2 border border-black dark:border-white text-black dark:text-white w-full py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-xs"
          >
            <span>FOLLOW INSTAGRAM</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Location Block */}
      <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 p-6 sm:p-8 flex items-start space-x-4">
        <MapPin size={20} className="text-black dark:text-white mt-1 flex-shrink-0" />
        <div className="space-y-1">
          <h3 className="text-xs font-extrabold tracking-widest uppercase text-black dark:text-white">
            STUDIO LOCATION
          </h3>
          <p className="text-xs font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {addressText}
          </p>
        </div>
      </div>
    </div>
  );
}
