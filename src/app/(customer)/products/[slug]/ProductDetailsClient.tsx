"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Star, ShoppingBag, ZoomIn, ZoomOut } from "lucide-react";
import PurchaseSheet from "@/components/purchase/PurchaseSheet";
import StateDropdown from "@/components/ui/StateDropdown";
import { createClient } from "@/utils/supabase/client";
import { loadDeliveryDetails } from "@/utils/localStorage";
import CustomerProductCard from "@/components/ui/CustomerProductCard";

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
  recommendedProducts: Product[];
}

export default function ProductDetailsClient({ product, recommendedProducts }: ProductDetailsClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [colorError, setColorError] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedState, setSelectedState] = useState("");
  const [shippingCharge, setShippingCharge] = useState<number | null>(null);

  const inlineBuyButtonRef = useRef<HTMLButtonElement>(null);
  const [isInlineVisible, setIsInlineVisible] = useState(true);

  useEffect(() => {
    const target = inlineBuyButtonRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsInlineVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, []);

  useEffect(() => {
    const saved = loadDeliveryDetails();
    if (saved?.state) {
      setSelectedState(saved.state);
      const fetchShipping = async () => {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("shipping_charges")
            .select("shipping_charge")
            .eq("state_name", saved.state)
            .eq("is_active", true)
            .maybeSingle();
          if (data) {
            setShippingCharge(data.shipping_charge);
          }
        } catch (e) {
          console.error("Failed to fetch shipping charge on mount", e);
        }
      };
      fetchShipping();
    }
  }, []);

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
            className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={12} />
            <span>Back to Collection</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left side: Images Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-[3/4] w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-sm overflow-hidden select-none cursor-pointer"
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
                    className={`relative aspect-square w-16 bg-neutral-50 dark:bg-neutral-900 border rounded-sm overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                      idx === activeImage
                        ? "border-black dark:border-white ring-1 ring-black dark:ring-white"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-450 dark:hover:border-neutral-550"
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
          <div className="space-y-8 select-none md:sticky md:top-24 self-start">
            <div className="space-y-3">
              {product.categories?.name && (
                <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-light">
                  {product.categories.name}
                </span>
              )}
              <h1 className="font-serif-luxury text-3xl font-light tracking-wide text-black dark:text-white uppercase leading-tight sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-xl font-mono font-medium text-black dark:text-white">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            <div className="h-[1px] bg-neutral-250 dark:bg-neutral-850" />

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Description / Composition
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-350 font-light leading-relaxed whitespace-pre-line max-w-md">
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
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                          : "bg-transparent text-neutral-600 dark:text-neutral-450 border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-[10px] text-red-500 font-light tracking-wide" role="alert">
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
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                          : "bg-transparent text-neutral-600 dark:text-neutral-450 border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
                {colorError && (
                  <p className="text-[10px] text-red-500 font-light tracking-wide" role="alert">
                    {colorError}
                  </p>
                )}
              </div>
            )}

            {/* Quantity picker */}
            <div className="space-y-3">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                Quantity
              </h4>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center border border-neutral-350 dark:border-neutral-800 rounded-sm text-neutral-500 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:animate-scale-tap"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center text-xs font-mono font-medium text-black dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-neutral-350 dark:border-neutral-800 rounded-sm text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors active:animate-scale-tap"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* State selection */}
            <div className="space-y-3 max-w-xs">
              <StateDropdown
                value={selectedState}
                onChange={(stateName, charge) => {
                  setSelectedState(stateName);
                  setShippingCharge(charge);
                }}
              />
            </div>

            {/* Price breakdown */}
            <div className="border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-sm p-4 space-y-3 max-w-md">
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold border-b border-neutral-250 dark:border-neutral-850 pb-2">
                Cost Summary
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-450 font-light">
                    Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
                  </span>
                  <span className="text-black dark:text-white font-mono">
                    ₹{(product.price * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-450 font-light">Shipping</span>
                  {shippingCharge !== null ? (
                    <span className="text-black dark:text-white font-mono">
                      ₹{shippingCharge.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-neutral-400 dark:text-neutral-600 text-[10px] font-light italic">
                      Select state to estimate
                    </span>
                  )}
                </div>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-850 my-1" />
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-black dark:text-white uppercase tracking-wider text-xs">Total Estimate</span>
                  <span className="text-black dark:text-white font-mono">
                    ₹{(product.price * quantity + (shippingCharge ?? 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buy Now button */}
            <button
              ref={inlineBuyButtonRef}
              type="button"
              onClick={handleBuyNow}
              className="flex w-full max-w-md items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black py-4 text-[10px] font-semibold tracking-widest uppercase transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm cursor-pointer active:animate-scale-tap"
            >
              <ShoppingBag size={14} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-16 space-y-8 select-none">
          <div className="border-t border-neutral-200 dark:border-neutral-850 pt-16">
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              Curated For You
            </span>
            <h2 className="text-2xl font-serif-luxury font-light tracking-wide text-black dark:text-white uppercase mt-1">
              Recommended Products
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {recommendedProducts.map((prod) => (
              <CustomerProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Buy Now button */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-850 safe-area-bottom transition-all duration-300 transform ${
          isInlineVisible ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-black dark:text-white truncate uppercase tracking-wide">
              {product.title}
            </p>
            <p className="text-sm font-mono font-medium text-black dark:text-white">
              ₹{(product.price * quantity + (shippingCharge ?? 0)).toFixed(2)}
            </p>
            {selectedState && (
              <p className="text-[9px] text-neutral-500 dark:text-neutral-450 font-light truncate">
                State: {selectedState} {shippingCharge !== null && `(Shipping: ₹${shippingCharge.toFixed(2)})`}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 text-[10px] font-semibold tracking-widest uppercase transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm cursor-pointer active:animate-scale-tap flex-shrink-0"
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
        quantity={quantity}
        initialState={selectedState}
        initialShippingCharge={shippingCharge}
      />
    </>
  );
}
