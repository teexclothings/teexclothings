"use client";

import Link from "next/link";

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
  const primaryImage = product.images?.[0] || "/placeholder-product.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block select-none focus:outline-none"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 border border-neutral-850 rounded-sm">
        {/* Featured Badge */}
        {product.featured && (
          <span className="absolute top-3 left-3 z-10 bg-white text-black text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm">
            Featured
          </span>
        )}

        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Tap/Hover dark overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="mt-3 space-y-1">
        {product.categories?.name && (
          <span className="block text-[9px] font-light tracking-[0.2em] text-neutral-500 uppercase">
            {product.categories.name}
          </span>
        )}
        <h3 className="text-xs font-light tracking-wide text-white group-hover:text-neutral-300 transition-colors uppercase truncate">
          {product.title}
        </h3>
        <p className="text-xs font-mono font-medium text-neutral-400">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
