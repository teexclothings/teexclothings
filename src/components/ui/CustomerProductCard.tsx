"use client";

import Link from "next/link";
import { Heart, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    featured: boolean;
    images: string[];
    categories?: {
      name: string;
    };
  };
}

export default function CustomerProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const primaryImage = product.images?.[0];

  return (
    <div className="group relative block select-none">
      <Link
        href={`/products/${product.slug}`}
        className="block focus:outline-none"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-neutral-200/80 rounded-xs flex items-center justify-center">
          {/* NEW / FEATURED Badge */}
          {product.featured && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-black text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-xs">
              FEATURED
            </span>
          )}

          {/* Primary Image or Clean SVG Placeholder */}
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 text-neutral-400 p-4 text-center">
              <ImageIcon size={28} strokeWidth={1.2} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">
                NO IMAGE
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      {/* Wishlist Heart Icon */}
      <button
        type="button"
        onClick={() => setLiked(!liked)}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-neutral-600 hover:text-black transition-all cursor-pointer focus:outline-none shadow-2xs"
        aria-label="Wishlist item"
      >
        <Heart
          size={14}
          className={liked ? "fill-black text-black" : "text-neutral-700"}
        />
      </button>

      {/* Product Details Info */}
      <div className="mt-3 space-y-1">
        <Link href={`/products/${product.slug}`} className="block group-hover:text-neutral-600 transition-colors">
          <h3 className="text-xs font-semibold tracking-wide text-black uppercase truncate">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs font-bold text-neutral-800 tracking-tight">
          ₹{Math.round(product.price)}
        </p>
      </div>
    </div>
  );
}
