"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Star, ShoppingBag, ZoomIn, ZoomOut } from "lucide-react";
import PurchaseSheet from "@/components/purchase/PurchaseSheet";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  featured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  categories?: {
    name: string;
  };
}

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [colorError, setColorError] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const galleryImages = product.images.length > 0 ? product.images : ["/placeholder-product.jpg"];

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0]?.clientX ?? 0;
      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && activeImage < galleryImages.length - 1) {
          setActiveImage((prev) => prev + 1);
        } else if (diff < 0 && activeImage > 0) {
          setActiveImage((prev) => prev - 1);
        }
      }
    },
    [activeImage, galleryImages.length],
  );

  function handleBuyNow() {
    let hasError = false;
    setSizeError("");
    setColorError("");

    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError("Please select a size");
      hasError = true;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setColorError("Please select a color");
      hasError = true;
    }

    if (!hasError) {
      setSheetOpen(true);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-16 space-y-8 flex-1 flex flex-col justify-start pb-28">
        {/* Return to collection */}
        <div className="select-none">
          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={12} />
            <span>Back to Collection</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left side: Images Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-[3/4] w-full bg-neutral-900 border border-neutral-850 rounded-sm overflow-hidden select-none cursor-pointer"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => setZoomed(!zoomed)}
            >
              {product.featured && (
                <span className="absolute top-4 left-4 z-10 bg-white text-black text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm flex items-center space-x-1 shadow-md">
                  <Star size={8} fill="currentColor" />
                  <span>Featured</span>
                </span>
              )}

              {/* Zoom indicator */}
              <button
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed(!zoomed);
                }}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImages[activeImage]}
                alt={product.title}
                className={`h-full w-full transition-all duration-500 ${
                  zoomed ? "object-contain scale-150" : "object-cover"
                }`}
              />

              {/* Swipe indicator dots */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeImage
                          ? "bg-white w-4"
                          : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1 select-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square w-16 bg-neutral-900 border rounded-sm overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                      idx === activeImage
                        ? "border-white ring-1 ring-white"
                        : "border-neutral-800 hover:border-neutral-500"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Product info */}
          <div className="space-y-8 self-center select-none">
            <div className="space-y-3">
              {product.categories?.name && (
                <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-light">
                  {product.categories.name}
                </span>
              )}
              <h1 className="font-serif-luxury text-3xl font-light tracking-wide text-white uppercase leading-tight sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-xl font-mono font-medium text-white">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            <div className="h-[1px] bg-neutral-900" />

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Description / Composition
                </h4>
                <p className="text-xs text-neutral-300 font-light leading-relaxed whitespace-pre-line max-w-md">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size picker */}
            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSize(sz);
                        setSizeError("");
                      }}
                      className={`px-4 py-2 border text-[9px] font-mono font-semibold uppercase rounded-sm transition-all cursor-pointer active:animate-scale-tap ${
                        selectedSize === sz
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-[10px] text-red-400 font-light tracking-wide" role="alert">
                    {sizeError}
                  </p>
                )}
              </div>
            )}

            {/* Color picker */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Available Colors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedColor(col);
                        setColorError("");
                      }}
                      className={`px-4 py-2 border text-[9px] uppercase tracking-widest font-semibold rounded-sm transition-all cursor-pointer active:animate-scale-tap ${
                        selectedColor === col
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
                {colorError && (
                  <p className="text-[10px] text-red-400 font-light tracking-wide" role="alert">
                    {colorError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Buy Now button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-neutral-800 safe-area-bottom">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate uppercase tracking-wide">
              {product.title}
            </p>
            <p className="text-sm font-mono font-medium text-white">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center space-x-2 bg-white text-black px-6 py-3.5 text-[10px] font-semibold tracking-widest uppercase transition-all hover:bg-neutral-200 rounded-sm cursor-pointer active:animate-scale-tap flex-shrink-0"
          >
            <ShoppingBag size={14} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Purchase Bottom Sheet */}
      <PurchaseSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        product={product}
        selectedSize={selectedSize || "Not specified"}
        selectedColor={selectedColor || "Not specified"}
      />
    </>
  );
}
