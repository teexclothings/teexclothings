import { createClient } from "@/utils/supabase/server";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact | TEEX",
  description: "Get in touch with our customer service team or visit our flagship studio location.",
};

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24 space-y-12 flex-1 flex flex-col justify-center select-none">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase font-light">
          Client Services
        </span>
        <h1 className="font-serif-luxury text-4xl font-light tracking-widest text-white uppercase sm:text-5xl">
          Get In Touch
        </h1>
        <div className="mx-auto h-[1px] w-12 bg-neutral-800 mt-4" />
      </div>

      {/* Details block */}
      {!settings ? (
        <div className="border border-neutral-900 bg-neutral-950 p-12 text-center rounded-sm">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-600">
            Contact info unavailable
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            We are currently updating our communications lines. Please check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Main contacts */}
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-white border-b border-neutral-905 pb-2">
              Direct Contact
            </h3>
            <ul className="space-y-4 text-xs font-light text-neutral-300">
              {settings.email && (
                <li className="flex items-center space-x-3">
                  <Mail size={14} className="text-neutral-500" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center space-x-3">
                  <Phone size={14} className="text-neutral-500" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex items-center space-x-3">
                  <MessageSquare size={14} className="text-neutral-500" />
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp Chat Support
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Location & Social */}
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-white border-b border-neutral-905 pb-2">
              Studio Location
            </h3>
            {settings.address ? (
              <div className="flex items-start space-x-3 text-xs font-light text-neutral-300 leading-relaxed">
                <MapPin size={14} className="text-neutral-500 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 font-light">Online Concept Studio</p>
            )}

            <div className="space-y-3 pt-2">
              <h4 className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
                Follow Silhouettes
              </h4>
              <div className="flex space-x-3 text-neutral-400">
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors p-1"
                    aria-label="Instagram Handle"
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
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors p-1"
                    aria-label="Facebook Handle"
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
        </div>
      )}
    </div>
  );
}
