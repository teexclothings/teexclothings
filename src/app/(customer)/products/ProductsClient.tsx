"use client";

import { useState } from "react";
import CustomerProductCard from "@/components/ui/CustomerProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  featured: boolean;
  images: string[];
  category_id: string;
  created_at: string;
  categories?: {
    name: string;
  };
}

interface ProductsClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function ProductsClient({
  initialCategories,
  initialProducts,
}: ProductsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortKey, setSortKey] = useState("newest");

  // Filtering
  const filtered = initialProducts.filter((product) => {
    const matchCategory = selectedCategory === "" || product.category_id === selectedCategory;
    const matchSearch =
      search.trim() === "" ||
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      (product.categories?.name &&
        product.categories.name.toLowerCase().includes(search.toLowerCase()));

    return matchCategory && matchSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "price-asc") {
      return a.price - b.price;
    }
    if (sortKey === "price-desc") {
      return b.price - a.price;
    }
    // "newest" defaults to creation date order
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10 flex-1 flex flex-col justify-start">
      {/* Header and overview */}
      <div className="border-b border-neutral-900 pb-6">
        <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-light">
          Silhouettes
        </span>
        <h1 className="font-serif-luxury text-4xl font-light tracking-widest text-white uppercase mt-1">
          Catalog Collection
        </h1>
      </div>

      {/* Filter and sorting triggers */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between select-none">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="SEARCH COLLECTION..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-[10px] tracking-widest uppercase px-10 py-3 rounded-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-500 text-white font-medium"
          />
        </div>

        {/* Curation Selectors */}
        <div className="flex space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-[9px] tracking-widest uppercase px-4 py-3 text-neutral-400 rounded-sm focus:outline-none focus:border-neutral-500 cursor-pointer font-semibold"
          >
            <option value="">All Collections</option>
            {initialCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-[9px] tracking-widest uppercase px-4 py-3 text-neutral-400 rounded-sm focus:outline-none focus:border-neutral-500 cursor-pointer font-semibold"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {sorted.length === 0 ? (
        <div className="rounded-sm border border-neutral-900 bg-neutral-950 p-24 text-center my-auto flex-1 flex flex-col justify-center items-center">
          <SlidersHorizontal className="text-neutral-700 mb-4" size={32} />
          <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-500">
            No items match filters
          </h3>
          <p className="text-xs text-neutral-600 font-light mt-1 max-w-sm">
            Try adjusting your search keywords or sorting criteria to discover silhouettes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 animate-fade-in">
          {sorted.map((product) => (
            <CustomerProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
