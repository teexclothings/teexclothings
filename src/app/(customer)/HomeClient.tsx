"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { ArrowRight, ChevronLeft, ChevronRight, VolumeX, ShieldCheck, RefreshCw, Sparkles, MessageCircle, Image as ImageIcon, Layers } from "lucide-react";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  media_url: string;
  media_type: "image" | "video";
  mobile_media_url?: string | null;
  mobile_media_type?: "image" | "video" | null;
  button_text: string | null;
  button_link: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  featured: boolean;
  images: string[];
  category_id: string;
  categories?: {
    name: string;
  };
}

interface HomeClientProps {
  initialBanners: Banner[];
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function HomeClient({
  initialBanners,
  initialCategories,
  initialProducts,
}: HomeClientProps) {
  const [activeBanner, setActiveBanner] = useState(0);

  // Auto rotate banners every 8 seconds if there are multiple banners
  useEffect(() => {
    if (initialBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % initialBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [initialBanners.length]);

  const handlePrevBanner = () => {
    setActiveBanner((prev) => (prev - 1 + initialBanners.length) % initialBanners.length);
  };

  const handleNextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % initialBanners.length);
  };

  // Products with valid images for Instagram grid (backend data)
  const productsWithImages = initialProducts.filter((p) => p.images && p.images.length > 0);

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[460px] max-h-[640px] bg-neutral-100 overflow-hidden select-none">
        {initialBanners.length === 0 ? (
          /* Default Banner Placeholder layout if no banner is added in Admin yet */
          <div className="relative inset-0 h-full w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-12 bg-neutral-100">
            <div className="max-w-xl space-y-4 z-10 text-left">
              <span className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase">
                NEW DROP
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black uppercase leading-none">
                PREMIUM <br /> STREETWEAR
              </h1>
              <p className="text-sm font-medium text-neutral-600">
                Minimal designs. Maximum impact.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-3 bg-black text-white px-7 py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all rounded-xs"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pure SVG Placeholder Frame */}
            <div className="hidden md:flex w-1/2 h-full relative items-center justify-center bg-neutral-200/60 border border-neutral-300 rounded-xs">
              <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                <ImageIcon size={48} strokeWidth={1} />
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  HERO BANNER MEDIA PLACEHOLDER
                </span>
                <span className="text-[9px] text-neutral-400">
                  Add hero banners in Admin Dashboard
                </span>
              </div>
            </div>
          </div>
        ) : (
          initialBanners.map((banner, index) => {
            const isActive = index === activeBanner;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Media background */}
                {(() => {
                  const hasMobileMedia = Boolean(banner.mobile_media_url);
                  const mobileUrl = banner.mobile_media_url || banner.media_url;
                  const mobileType = banner.mobile_media_url
                    ? banner.mobile_media_type || "image"
                    : banner.media_type;

                  return (
                    <>
                      {/* Desktop Media */}
                      <div className={`absolute inset-0 h-full w-full ${hasMobileMedia ? "hidden sm:block" : ""}`}>
                        {banner.media_type === "video" ? (
                          <div className="relative h-full w-full bg-black">
                            <video
                              src={banner.media_url}
                              className="h-full w-full object-cover opacity-90"
                              muted
                              loop
                              autoPlay
                              playsInline
                            />
                            <div className="absolute bottom-6 right-6 text-neutral-400 p-2">
                              <VolumeX size={14} />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={banner.media_url}
                            alt={banner.title || "Hero banner"}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      {/* Mobile Media */}
                      {hasMobileMedia && (
                        <div className="absolute inset-0 h-full w-full sm:hidden">
                          {mobileType === "video" ? (
                            <div className="relative h-full w-full bg-black">
                              <video
                                src={mobileUrl}
                                className="h-full w-full object-cover opacity-90"
                                muted
                                loop
                                autoPlay
                                playsInline
                              />
                            </div>
                          ) : (
                            <img
                              src={mobileUrl}
                              alt={banner.title || "Hero banner"}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Light Overlay gradient for high copy legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent sm:from-white/80" />

                {/* Banner Content Copy */}
                <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 text-left">
                  <div className="max-w-xl space-y-4 animate-slide-up">
                    {banner.subtitle && (
                      <span className="block text-xs font-bold tracking-[0.25em] text-neutral-600 uppercase">
                        {banner.subtitle}
                      </span>
                    )}
                    {banner.title && (
                      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black uppercase leading-tight">
                        {banner.title}
                      </h1>
                    )}
                    {banner.button_text && (
                      <div className="pt-2">
                        <Link
                          href={banner.button_link || "/products"}
                          className="inline-flex items-center space-x-3 bg-black text-white px-7 py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all rounded-xs shadow-xs"
                        >
                          <span>{banner.button_text}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Carousel slide indicators */}
        {initialBanners.length > 1 && (
          <>
            <button
              onClick={handlePrevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-black/60 hover:text-black transition-colors focus:outline-none cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-black/60 hover:text-black transition-colors focus:outline-none cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
              {initialBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`transition-all cursor-pointer ${
                    index === activeBanner
                      ? "h-1 w-6 bg-black rounded-full"
                      : "h-2 w-2 rounded-full bg-neutral-400 hover:bg-neutral-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. CATEGORIES SECTION - FIND YOUR STYLE */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              SHOP BY COLLECTION
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black uppercase mt-0.5">
              FIND YOUR STYLE
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase text-black hover:text-neutral-600 transition-colors"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Categories Grid from Backend */}
        {initialCategories.length === 0 ? (
          <div className="rounded-xs border border-neutral-200 bg-neutral-50 p-12 text-center text-xs text-neutral-500 uppercase">
            No categories defined in database.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {initialCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 rounded-xs border border-neutral-200 block select-none"
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  /* SVG/CSS Category Placeholder Box */
                  <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center p-6 text-center text-neutral-500 space-y-2">
                    <Layers size={32} strokeWidth={1.2} className="text-neutral-400" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                      CATEGORY PLACEHOLDER
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-extrabold tracking-wider uppercase drop-shadow-xs">
                    {cat.name}
                  </span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. NEW ARRIVALS / JUST LANDED PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              NEW ARRIVALS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black uppercase mt-0.5">
              JUST LANDED
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase text-black hover:text-neutral-600 transition-colors"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {initialProducts.length === 0 ? (
          <div className="rounded-xs border border-neutral-200 bg-neutral-50 p-12 text-center text-xs text-neutral-500 uppercase">
            No products available yet in catalog.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {initialProducts.slice(0, 6).map((product) => (
              <CustomerProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. VALUE PROPOSITIONS / FEATURES BAR */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xs border border-neutral-200 bg-neutral-50/80 p-8 text-center">
          <div className="flex flex-col items-center space-y-2 px-4">
            <Sparkles className="text-black mb-1" size={24} strokeWidth={1.5} />
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-black">
              PREMIUM QUALITY
            </h3>
            <p className="text-xs font-light text-neutral-500 max-w-xs leading-relaxed">
              100% premium cotton fabrics for all-day comfort.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 px-4 border-t md:border-t-0 md:border-l border-neutral-200 pt-6 md:pt-0">
            <RefreshCw className="text-black mb-1" size={24} strokeWidth={1.5} />
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-black">
              EASY RETURNS
            </h3>
            <p className="text-xs font-light text-neutral-500 max-w-xs leading-relaxed">
              No questions asked 7-day return policy.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 px-4 border-t md:border-t-0 md:border-l border-neutral-200 pt-6 md:pt-0">
            <ShieldCheck className="text-black mb-1" size={24} strokeWidth={1.5} />
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-black">
              SECURE ORDERING
            </h3>
            <p className="text-xs font-light text-neutral-500 max-w-xs leading-relaxed">
              Order directly on WhatsApp 100% safe & secure.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SHOP THE LOOK / INSTAGRAM GALLERY */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              SHOP THE LOOK
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black uppercase mt-0.5">
              @_TEEX
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 border border-neutral-300 bg-white px-4 py-2 text-xs font-bold tracking-wider uppercase text-black hover:bg-neutral-100 transition-colors rounded-xs"
          >
            <span>FOLLOW US ON INSTAGRAM</span>
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
        </div>

        {/* Gallery rendering backend product images or clean SVG placeholders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const product = productsWithImages[idx];
            const imgUrl = product?.images?.[0];

            return (
              <div
                key={idx}
                className="group relative aspect-square w-full overflow-hidden bg-neutral-100 border border-neutral-200/60 rounded-xs flex items-center justify-center"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={product?.title || `Product look ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1 text-neutral-400 p-2 text-center">
                    <ImageIcon size={20} strokeWidth={1.2} />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                      PLACEHOLDER
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. WHATSAPP ORDER CTA SECTION */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-xs border border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-100 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg text-left z-10">
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black uppercase leading-tight">
              ORDER ON WHATSAPP
            </h2>
            <p className="text-xs font-light text-neutral-600 leading-relaxed">
              Chat with us directly and place your order in seconds.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 bg-black text-white px-7 py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all rounded-xs shadow-xs"
              >
                <span>CHAT NOW</span>
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Right Phone Mockup graphic */}
          <div className="w-full md:w-80 h-48 md:h-64 relative flex items-center justify-center">
            <div className="w-56 h-full border-4 border-neutral-900 bg-neutral-900 rounded-[2rem] p-2 shadow-xl overflow-hidden flex flex-col justify-between">
              <div className="bg-neutral-800 rounded-t-[1.5rem] p-3 text-white text-[10px] flex items-center justify-between font-mono">
                <span className="font-bold">TEEX Official</span>
                <span className="text-[8px] text-green-400">● Online</span>
              </div>
              <div className="flex-1 bg-neutral-950 p-3 space-y-2 overflow-hidden flex flex-col justify-end">
                <div className="bg-neutral-800 text-white text-[9px] p-2 rounded-lg max-w-[80%] self-start">
                  Hi! I want to order this tee...
                </div>
                <div className="bg-green-700 text-white text-[9px] p-2 rounded-lg max-w-[80%] self-end">
                  Sure! Share your size & location!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
