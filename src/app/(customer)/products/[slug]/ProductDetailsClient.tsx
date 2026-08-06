"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Star } from "lucide-react";

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

  const galleryImages = product.images.length > 0 ? product.images : ["/placeholder-product.jpg"];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-16 space-y-8 flex-1 flex flex-col justify-start">
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
        {/* Left side: Images Gallery (Mobile-first stack, Desktop side-by-side) */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full bg-neutral-900 border border-neutral-850 rounded-sm overflow-hidden select-none">
            {product.featured && (
              <span className="absolute top-4 left-4 z-10 bg-white text-black text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm flex items-center space-x-1 shadow-md">
                <Star size={8} fill="currentColor" />
                <span>Featured</span>
              </span>
            )}
            <img
              src={galleryImages[activeImage]}
              alt={product.title}
              className="h-full w-full object-cover transition-opacity duration-500"
            />
          </div>

          {/* Thumbnail list */}
          {galleryImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1 select-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square w-16 bg-neutral-900 border rounded-sm overflow-hidden flex-shrink-0 cursor-pointer ${
                    idx === activeImage ? "border-white" : "border-neutral-800 hover:border-neutral-500"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Product Options info */}
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
            <p className="text-xl font-mono font-medium text-white">${product.price.toFixed(2)}</p>
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
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 border text-[9px] font-mono font-semibold uppercase rounded-sm transition-all cursor-pointer ${
                      selectedSize === sz
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
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
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 border text-[9px] uppercase tracking-widest font-semibold rounded-sm transition-all cursor-pointer ${
                      selectedColor === col
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy Button UI-Only */}
          <div className="pt-4">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-white bg-white px-8 py-3.5 text-[10px] font-semibold tracking-widest uppercase text-black transition-all hover:bg-transparent hover:text-white rounded-sm focus:outline-none cursor-pointer"
            >
              <span>Secure Silhouette</span>
              <ArrowRight size={12} />
            </button>
            <span className="block text-[8px] tracking-wider uppercase text-neutral-600 font-light mt-2.5">
              * Order processing will continue through secure WhatsApp confirmation on the next phase.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
