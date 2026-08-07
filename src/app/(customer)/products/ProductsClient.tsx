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
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10 flex-1 flex flex-col justify-start bg-white text-black">
      {/* Header and overview */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
          Silhouettes
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black uppercase mt-1">
          Catalog Collection
        </h1>
      </div>

      {/* Filter and sorting triggers */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between select-none">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="SEARCH COLLECTION..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-xs tracking-widest uppercase px-10 py-3 rounded-xs placeholder-neutral-400 focus:outline-none focus:border-black text-black font-semibold"
          />
        </div>

        {/* Curation Selectors */}
        <div className="flex space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs tracking-widest uppercase px-4 py-3 text-neutral-700 rounded-xs focus:outline-none focus:border-black cursor-pointer font-bold"
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
            className="bg-neutral-50 border border-neutral-200 text-xs tracking-widest uppercase px-4 py-3 text-neutral-700 rounded-xs focus:outline-none focus:border-black cursor-pointer font-bold"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {sorted.length === 0 ? (
        <div className="rounded-xs border border-neutral-200 bg-neutral-50 p-16 text-center space-y-2">
          <SlidersHorizontal className="mx-auto text-neutral-400" size={32} />
          <h3 className="text-xs uppercase font-bold tracking-widest text-black">
            No silhouettes matched
          </h3>
          <p className="text-xs text-neutral-500 font-light">
            Try adjusting your search criteria or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sorted.map((product) => (
            <CustomerProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
