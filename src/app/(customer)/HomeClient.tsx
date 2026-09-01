"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { buildCloudinaryUrl } from "@/utils/cloudinaryUrl";
import { ArrowRight, ChevronLeft, ChevronRight, VolumeX, ShieldCheck, Truck, Sparkles, MessageCircle, Image as ImageIcon, Layers } from "lucide-react";

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

interface SiteSettings {
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

interface HomeClientProps {
  initialBanners: Banner[];
  initialCategories: Category[];
  initialProducts: Product[];
  settings: SiteSettings | null;
}

/** Extract Instagram handle from a URL like https://instagram.com/_teex */
function extractInstagramHandle(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    const handle = pathname.split("/").pop();
    return handle ? `@${handle}` : null;
  } catch {
    return null;
  }
}

export default function HomeClient({
  initialBanners,
  initialCategories,
  initialProducts,
  settings,
}: HomeClientProps) {
  const [activeBanner, setActiveBanner] = useState(0);
  const instaScrollRef = useRef<HTMLDivElement>(null);

  // Auto rotate banners every 8 seconds if there are multiple banners
  useEffect(() => {
    if (initialBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % initialBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [initialBanners.length]);

  // Auto slide mobile Instagram gallery every 4 seconds
  useEffect(() => {
    const el = instaScrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 160, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevBanner = () => {
    setActiveBanner((prev) => (prev - 1 + initialBanners.length) % initialBanners.length);
  };

  const handleNextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % initialBanners.length);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      handleNextBanner();
    } else if (distance < -40) {
      handlePrevBanner();
    }
  };

  // Products with valid images for Instagram grid (backend data)
  const productsWithImages = initialProducts.filter((p) => p.images && p.images.length > 0);

  return (
    <div className="space-y-16 pb-20 bg-transparent">
      {/* 1. HERO BANNER SECTION */}
      <section
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[460px] max-h-[640px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden select-none"
      >
        {initialBanners.length === 0 ? (
          /* Default Banner Placeholder layout if no banner is added in Admin yet */
          <div className="relative inset-0 h-full w-full flex flex-col md:flex-row items-center justify-between px-5 sm:px-14 md:px-24 lg:px-28 py-12 bg-neutral-100 dark:bg-neutral-900">
            <div className="max-w-[55%] sm:max-w-md md:max-w-xl space-y-2 sm:space-y-4 z-10 text-left">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 uppercase">
                NEW DROP
              </span>
              <h1 className="text-xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white uppercase leading-tight sm:leading-none">
                PREMIUM <br /> STREETWEAR
              </h1>
              <p className="text-[10px] sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Minimal designs. Maximum impact.
              </p>
              <div className="pt-1 sm:pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-3 bg-black text-white dark:bg-white dark:text-black px-7 py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-xs"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Pure SVG Placeholder Frame */}
            <div className="hidden md:flex w-1/2 h-full relative items-center justify-center bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs">
              <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                <ImageIcon size={48} strokeWidth={1} />
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
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
                            src={buildCloudinaryUrl(banner.media_url, { width: 1600 })}
                            alt={banner.title || "Hero banner"}
                            className="h-full w-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "auto"}
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
                              src={buildCloudinaryUrl(mobileUrl, { width: 900 })}
                              alt={banner.title || "Hero banner"}
                              className="h-full w-full object-cover"
                              loading={index === 0 ? "eager" : "lazy"}
                              fetchPriority={index === 0 ? "high" : "auto"}
                            />
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Light Overlay gradient for high copy legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent sm:from-white/80 dark:from-black/90 dark:via-black/40" />

                {/* Banner Content Copy */}
                <div className="absolute inset-0 flex items-center justify-start px-5 sm:px-14 md:px-24 lg:px-28 text-left">
                  <div className="max-w-[55%] sm:max-w-md md:max-w-xl space-y-2 sm:space-y-4 animate-slide-up">
                    <span className="block text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-700 dark:text-neutral-300 uppercase">
                      {banner.subtitle || "NEW DROP"}
                    </span>

                    {banner.title && (
                      <h1 className="text-xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white uppercase leading-tight sm:leading-none whitespace-pre-line">
                        {banner.title}
                      </h1>
                    )}

                    {banner.button_text && (
                      <p className="text-[10px] sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-normal sm:leading-relaxed line-clamp-3">
                        {banner.button_text}
                      </p>
                    )}

                    <div className="pt-1 sm:pt-2">
                      <Link
                        href="/products"
                        className="inline-flex items-center space-x-2 sm:space-x-3 bg-black text-white dark:bg-white dark:text-black px-4 py-2 sm:px-7 sm:py-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-xs shadow-xs"
                      >
                        <span>EXPLORE COLLECTION</span>
                        <ArrowRight size={13} className="sm:w-[14px] sm:h-[14px]" />
                      </Link>
                    </div>
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
              className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextBanner}
              className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
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
                      ? "h-1 w-6 bg-black dark:bg-white rounded-full"
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
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              SHOP BY COLLECTION
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5 whitespace-nowrap">
              FIND YOUR STYLE
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Categories Display (Desktop Grid + Mobile Circular Avatars) */}
        {initialCategories.length === 0 ? (
          <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900 p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 uppercase">
            No categories defined in database.
          </div>
        ) : (
          <>
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4">
              {initialCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug || cat.id}`}
                  className="group relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 rounded-xs border border-neutral-200 dark:border-neutral-850 block select-none"
                >
                  {cat.image_url ? (
                    <img
                      src={buildCloudinaryUrl(cat.image_url, { width: 480 })}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
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

            {/* Mobile Circular Avatars Layout (Matching attached reference design) */}
            <div className="flex md:hidden space-x-6 overflow-x-auto pb-4 pt-1 select-none scrollbar-none items-start">
              {initialCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug || cat.id}`}
                  className="group flex flex-col items-center flex-shrink-0 w-20 sm:w-24 focus:outline-none"
                >
                  {/* Circle Image Avatar */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-2xs group-hover:border-black dark:group-hover:border-white transition-all flex items-center justify-center">
                    {cat.image_url ? (
                      <img
                        src={buildCloudinaryUrl(cat.image_url, { width: 200 })}
                        alt={cat.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <Layers size={22} strokeWidth={1.2} />
                      </div>
                    )}
                  </div>

                  {/* Centered Category Label Below Circle */}
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-black dark:text-white text-center mt-2.5 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors leading-tight line-clamp-2 px-0.5">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 3. NEW ARRIVALS / JUST LANDED PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              NEW ARRIVALS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5">
              JUST LANDED
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors whitespace-nowrap"
          >
            <span>VIEW ALL<span className="hidden sm:inline"> PRODUCTS</span></span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {initialProducts.length === 0 ? (
          <div className="rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900 p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 uppercase">
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
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="grid grid-cols-3 gap-1 sm:gap-6 rounded-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50/80 dark:bg-neutral-900/50 p-3 sm:p-8 text-center items-start">
          <div className="flex flex-col items-center space-y-1 sm:space-y-2 px-0.5 sm:px-4">
            <Sparkles className="text-black dark:text-white mb-1 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            <h3 className="text-[9px] sm:text-xs font-extrabold tracking-wider uppercase text-black dark:text-white leading-tight">
              PREMIUM QUALITY
            </h3>
            <p className="text-[8px] sm:text-xs font-light text-neutral-500 dark:text-neutral-400 max-w-xs leading-tight sm:leading-relaxed">
              100% premium cotton fabric.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2 px-0.5 sm:px-4 border-l border-neutral-200 dark:border-neutral-800">
            <Truck className="text-black dark:text-white mb-1 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            <h3 className="text-[9px] sm:text-xs font-extrabold tracking-wider uppercase text-black dark:text-white leading-tight">
              EXPRESS SHIPPING
            </h3>
            <p className="text-[8px] sm:text-xs font-light text-neutral-500 dark:text-neutral-400 max-w-xs leading-tight sm:leading-relaxed">
              Fast delivery across India.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-2 px-0.5 sm:px-4 border-l border-neutral-200 dark:border-neutral-800">
            <ShieldCheck className="text-black dark:text-white mb-1 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            <h3 className="text-[9px] sm:text-xs font-extrabold tracking-wider uppercase text-black dark:text-white leading-tight">
              SECURE ORDERING
            </h3>
            <p className="text-[8px] sm:text-xs font-light text-neutral-500 dark:text-neutral-400 max-w-xs leading-tight sm:leading-relaxed">
              Direct WhatsApp checkout.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SHOP THE LOOK / INSTAGRAM GALLERY */}
      <section className="mx-auto max-w-7xl px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-850 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              SHOP THE LOOK
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase mt-0.5">
              {extractInstagramHandle(settings?.instagram) || "@_TEEX"}
            </h2>
          </div>
          <a
            href={settings?.instagram || "https://instagram.com"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 md:space-x-2 border-0 md:border md:border-neutral-300 dark:md:border-neutral-700 bg-transparent md:bg-white dark:md:bg-neutral-900 p-0 md:px-4 md:py-2 text-xs font-bold tracking-wider uppercase text-black dark:text-white hover:opacity-80 md:hover:bg-neutral-100 dark:md:hover:bg-neutral-800 transition-colors rounded-xs"
          >
            <span>FOLLOW US<span className="hidden md:inline"> ON INSTAGRAM</span></span>
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
        </div>

        {/* Desktop Grid (6 Columns) */}
        <div className="hidden md:grid md:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const product = productsWithImages[idx];
            const imgUrl = product?.images?.[0];

            return (
              <div
                key={idx}
                className="group relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xs flex items-center justify-center"
              >
                {imgUrl ? (
                  <img
                    src={buildCloudinaryUrl(imgUrl, { width: 400 })}
                    alt={product?.title || `Product look ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
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

        {/* Mobile Touch-Swipable + Auto-Sliding Image Row */}
        <div
          ref={instaScrollRef}
          className="flex md:hidden space-x-3 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth py-1 select-none"
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const product = productsWithImages[idx];
            const imgUrl = product?.images?.[0];

            return (
              <div
                key={idx}
                className="group relative w-36 aspect-[3/4] flex-shrink-0 snap-start overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xs flex items-center justify-center"
              >
                {imgUrl ? (
                  <img
                    src={buildCloudinaryUrl(imgUrl, { width: 400 })}
                    alt={product?.title || `Product look ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1 text-neutral-400 p-2 text-center">
                    <ImageIcon size={20} strokeWidth={1.2} />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                      PLACEHOLDER
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. WHATSAPP ORDER CTA SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-xs border border-neutral-200 dark:border-neutral-850 bg-gradient-to-r from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 p-5 sm:p-8 md:p-12 flex flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Left Text Content */}
          <div className="w-7/12 sm:w-1/2 space-y-2 sm:space-y-3 text-left z-10">
            <span className="block text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 dark:text-neutral-400 uppercase">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase leading-tight">
              ORDER ON WHATSAPP
            </h2>
            <p className="text-[10px] sm:text-xs font-light text-neutral-600 dark:text-neutral-400 leading-normal sm:leading-relaxed">
              Chat with us directly and place your order in seconds.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${settings?.whatsapp?.replace(/[^\d]/g, "") || ""}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-black text-white dark:bg-white dark:text-black px-3.5 py-2 sm:px-6 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all rounded-xs shadow-xs"
              >
                <span>CHAT NOW</span>
                <MessageCircle size={13} className="sm:w-[15px] sm:h-[15px]" />
              </a>
            </div>
          </div>

          {/* Right Image Container (Phone top 100% visible, bottom ~30% cropped past card bottom border) */}
          <div className="w-5/12 sm:w-1/2 h-36 sm:h-52 md:h-60 relative flex items-start justify-center -mb-5 sm:-mb-8 md:-mb-12 overflow-hidden">
            <img
              src="/images/whatsapp-message.png"
              alt="Order on WhatsApp Chat Preview"
              className="h-[140%] sm:h-[150%] md:h-[160%] w-auto max-w-none object-cover object-top drop-shadow-md origin-top"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
