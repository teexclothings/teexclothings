"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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
  categories?: {
    name: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens & fetch data
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    // Focus input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();

      const [prodRes, catRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, title, slug, price, featured, images, category_id, categories(name)")
          .eq("active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("id, name")
          .eq("active", true)
          .order("created_at", { ascending: true }),
      ]);

      if (prodRes.data) setProducts(prodRes.data as Product[]);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };

    fetchData();
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter matching products
  const cleanQuery = query.trim().toLowerCase();
  const matchingProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.categories?.name?.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Popular suggestion pills
  const popularPills = [
    { label: "All Products", search: "" },
    ...categories.map((c) => ({ label: c.name, search: c.name })),
  ];

  // Suggested products (featured or fallback to first few products)
  const suggestedProducts = products.filter((p) => p.featured).slice(0, 4);
  const displaySuggested = suggestedProducts.length > 0 ? suggestedProducts : products.slice(0, 4);

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    onClose();
    if (searchTerm) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-24 px-2 sm:px-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Backdrop overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 text-neutral-900 dark:text-neutral-100 transition-all duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search size={20} className="text-neutral-400 dark:text-neutral-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(query);
              }
            }}
            placeholder="Search products, categories, or tags..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 mr-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-neutral-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-xs uppercase tracking-widest font-semibold">Loading collection...</span>
            </div>
          ) : cleanQuery ? (
            /* Search Results State */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  SEARCH RESULTS ({matchingProducts.length})
                </span>
              </div>

              {matchingProducts.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No products matching &quot;<span className="font-semibold text-black dark:text-white">{query}</span>&quot;
                  </p>
                  <button
                    onClick={() => handleSearchSubmit("")}
                    className="text-xs font-semibold text-black dark:text-white underline hover:opacity-80 cursor-pointer"
                  >
                    View all products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200/60 dark:border-neutral-800/60">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[9px]">
                              NO IMG
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-black dark:text-white truncate">
                            {product.title}
                          </h4>
                          {product.categories?.name && (
                            <span className="block text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                              {product.categories.name}
                            </span>
                          )}
                          <span className="block text-xs font-extrabold text-black dark:text-white mt-0.5">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all ml-2 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Default Empty Query State */
            <>
              {/* Popular Suggestions Pills */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                  POPULAR SUGGESTIONS
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularPills.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSubmit(pill.search)}
                      className="px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Products List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                    SUGGESTED PRODUCTS
                  </span>
                  <button
                    onClick={() => handleSearchSubmit("")}
                    className="inline-flex items-center text-xs font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-75 transition-opacity cursor-pointer space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displaySuggested.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200/60 dark:border-neutral-800/60">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[9px]">
                              NO IMG
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-black dark:text-white truncate">
                            {product.title}
                          </h4>
                          {product.categories?.name && (
                            <span className="block text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                              {product.categories.name}
                            </span>
                          )}
                          <span className="block text-xs font-extrabold text-black dark:text-white mt-0.5">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all ml-2 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Link if search query exists */}
        {cleanQuery && matchingProducts.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50/50 dark:bg-neutral-900/30 text-center">
            <button
              onClick={() => handleSearchSubmit(query)}
              className="inline-flex items-center text-xs font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-75 transition-opacity cursor-pointer space-x-1.5"
            >
              <span>View all results for &quot;{query}&quot;</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
