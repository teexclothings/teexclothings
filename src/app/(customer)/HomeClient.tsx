"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { ArrowRight, ChevronLeft, ChevronRight, VolumeX } from "lucide-react";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  media_url: string;
  media_type: "image" | "video";
  button_text: string | null;
  button_link: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Filter products based on selected category pill
  const filteredProducts = selectedCategory
    ? initialProducts.filter((p) => p.category_id === selectedCategory)
    : initialProducts;

  // Filter featured products
  const featuredProducts = initialProducts.filter((p) => p.featured);

  return (
    <div className="space-y-16 pb-24">
      {/* 1. HERO BANNER ROTATION SLIDER */}
      <section className="relative w-full aspect-[21/9] min-h-[480px] bg-neutral-950 overflow-hidden select-none border-b border-neutral-900">
        {initialBanners.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-light">
              Brand Showcase
            </span>
            <h2 className="font-serif-luxury text-3xl font-light tracking-wide text-white uppercase mt-2">
              TEEX CLOTHINGS
            </h2>
            <p className="text-xs text-neutral-400 font-light mt-1 max-w-sm">
              New minimalist silhouettes coming soon.
            </p>
          </div>
        ) : (
          initialBanners.map((banner, index) => {
            const isActive = index === activeBanner;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Media Render background */}
                {banner.media_type === "video" ? (
                  <div className="absolute inset-0 h-full w-full bg-black">
                    <video
                      src={banner.media_url}
                      className="h-full w-full object-cover opacity-75"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    {/* Premium video muted indicator */}
                    <div className="absolute bottom-6 right-6 text-neutral-500 hover:text-white p-2">
                      <VolumeX size={12} />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 h-full w-full">
                    <img
                      src={banner.media_url}
                      alt={banner.title || "Hero banner"}
                      className="h-full w-full object-cover opacity-80"
                    />
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

                {/* Banner Copy Content */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="max-w-2xl space-y-4 animate-slide-up">
                    {banner.subtitle && (
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light">
                        {banner.subtitle}
                      </span>
                    )}
                    {banner.title && (
                      <h1 className="font-serif-luxury text-3xl font-light tracking-widest text-white sm:text-5xl md:text-6xl uppercase leading-tight">
                        {banner.title}
                      </h1>
                    )}
                    <div className="mx-auto h-[1px] w-12 bg-neutral-800" />
                    {banner.button_text && (
                      <div className="pt-4">
                        <Link
                          href={banner.button_link || "/products"}
                          className="inline-flex items-center space-x-2 border border-white bg-white px-6 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-black transition-all hover:bg-transparent hover:text-white rounded-sm focus:outline-none"
                        >
                          <span>{banner.button_text}</span>
                          <ArrowRight size={12} />
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
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {initialBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`h-1.5 w-1.5 rounded-full transition-all cursor-pointer ${
                    index === activeBanner ? "bg-white scale-125" : "bg-neutral-600 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. DYNAMIC CATEGORY PILLS HORIZONTAL VIEW */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-6">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-light">
            Filter by curation
          </span>
        </div>

        {initialCategories.length === 0 ? (
          <div className="text-xs text-neutral-600 font-light">No collections defined.</div>
        ) : (
          <div className="flex space-x-2 overflow-x-auto scrollbar-none py-1 select-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 text-[9px] tracking-widest uppercase font-semibold transition-all rounded-full border cursor-pointer ${
                selectedCategory === null
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
              }`}
            >
              All Items
            </button>
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 text-[9px] tracking-widest uppercase font-semibold transition-all rounded-full border cursor-pointer flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED PRODUCTS (Grid rows of 4 cards) */}
      {featuredProducts.length > 0 && selectedCategory === null && (
        <section className="mx-auto max-w-7xl px-6 space-y-8 animate-fade-in">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-light">
              Limited items
            </span>
            <h2 className="font-serif-luxury text-2xl font-light tracking-widest text-white uppercase">
              Featured Pieces
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <CustomerProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. ALL PRODUCTS VIEW GRID */}
      <section className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-light">
            Core catalog
          </span>
          <h2 className="font-serif-luxury text-2xl font-light tracking-widest text-white uppercase">
            {selectedCategory
              ? initialCategories.find((c) => c.id === selectedCategory)?.name
              : "All Silhouette Curation"}
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-sm border border-neutral-900 bg-neutral-950 p-16 text-center">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-500">
              No products found
            </h3>
            <p className="text-xs text-neutral-600 font-light mt-1">
              There are no available silhouettes in this selection currently.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
            {filteredProducts.map((product) => (
              <CustomerProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
