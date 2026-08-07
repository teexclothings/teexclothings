import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us | TEEX Clothings",
  description: "Minimalist streetwear crafted for everyday wear. Heavyweight fabrics, timeless design, and direct WhatsApp ordering.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("shop_name")
    .eq("id", true)
    .maybeSingle();

  const brandName = settings?.shop_name || "TEEX CLOTHINGS";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-20 space-y-16 select-none">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
          OUR ETHOS
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white uppercase">
          {brandName}
        </h1>
        <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed pt-1">
          Minimalist streetwear engineered for comfort, durability, and everyday style.
        </p>
      </div>

      {/* Main Brand Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/40 p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
              01 / SIMPLICITY FIRST
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-black dark:text-white uppercase">
              PURE MINIMALISM
            </h2>
            <p className="text-xs font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
              We reject the fast fashion cycle. Every {brandName} t-shirt is designed with clean silhouettes, subtle branding, and classic cuts that fit effortlessly into your daily wardrobe.
            </p>
          </div>
        </div>

        <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/70 dark:bg-neutral-900/40 p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
              02 / PREMIUM CRAFT
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-black dark:text-white uppercase">
              HEAVYWEIGHT KNITS
            </h2>
            <p className="text-xs font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
              Crafted from 100% premium combed cotton with reinforced double-stitched borders. Built to retain shape, softness, and color drop after drop.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-xs border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center space-y-2 p-3">
          <Sparkles className="text-black dark:text-white mb-1" size={24} strokeWidth={1.5} />
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-black dark:text-white">
            PREMIUM QUALITY
          </h3>
          <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Ultra-soft 100% premium cotton tailored for everyday wear.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-850 pt-6 sm:pt-3">
          <Truck className="text-black dark:text-white mb-1" size={24} strokeWidth={1.5} />
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-black dark:text-white">
            SHIPS ACROSS INDIA
          </h3>
          <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Pan-India express delivery directly to your door.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-3 border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-850 pt-6 sm:pt-3">
          <ShieldCheck className="text-black dark:text-white mb-1" size={24} strokeWidth={1.5} />
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-black dark:text-white">
            WHATSAPP ORDERING
          </h3>
          <p className="text-[11px] font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Order directly on WhatsApp in seconds — no complex checkout needed.
          </p>
        </div>
      </div>

      {/* Explore Collection CTA */}
      <div className="text-center pt-4">
        <Link
          href="/products"
          className="inline-flex items-center space-x-3 bg-black text-white dark:bg-white dark:text-black px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-xs shadow-xs"
        >
          <span>EXPLORE CATALOG</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
