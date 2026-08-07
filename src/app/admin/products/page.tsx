"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { Plus, Search, Trash2, Edit2, Star, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string;
  sizes: string[];
  colors: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
  categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { showToast } = useToast();
  const supabase = createClient();

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);

    const { data: catData } = await supabase.from("categories").select("id, name");
    setCategories(catData || []);

    const { data: prodData, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      showToast(error.message, "error");
    } else {
      setProducts((prodData as unknown as Product[]) || []);
    }

    setLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleToggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ active: !product.active })
      .eq("id", product.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast(`Product ${product.active ? "disabled" : "enabled"} successfully.`, "success");
      fetchData();
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ featured: !product.featured })
      .eq("id", product.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast(
        `Product ${product.featured ? "removed from Featured" : "marked as Featured"} successfully.`,
        "success",
      );
      fetchData();
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const { error } = await supabase.from("products").delete().eq("id", deleteId);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Product deleted successfully.", "success");
      setDeleteOpen(false);
      fetchData();
    }

    setDeleteLoading(false);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = selectedCategory === "" || p.category_id === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-neutral-850 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
            Catalog inventory
          </span>
          <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex cursor-pointer items-center justify-center space-x-2 bg-black dark:bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black dark:text-white dark:text-black transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm select-none"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-10 py-2.5 text-xs tracking-wider uppercase text-black dark:text-white placeholder-neutral-600 focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs tracking-wider uppercase px-4 py-2.5 text-black dark:text-white rounded-sm focus:outline-none focus:border-black dark:focus:border-neutral-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-50 dark:bg-neutral-900/30 p-12 text-center">
          <ShoppingBag className="mx-auto text-neutral-700 mb-4" size={40} />
          <h3 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            No products found
          </h3>
          <p className="mt-1 text-xs font-light text-neutral-500">
            Create your first catalog item by clicking the Add Product button above.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 tracking-widest uppercase font-light">
                <th className="px-6 py-4 font-light">Title</th>
                <th className="px-6 py-4 font-light">Category</th>
                <th className="px-6 py-4 font-light">Price</th>
                <th className="px-6 py-4 text-center font-light">Featured</th>
                <th className="px-6 py-4 text-center font-light">Status</th>
                <th className="px-6 py-4 text-right font-light">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="transition-colors hover:bg-neutral-100 dark:bg-neutral-800/20">
                  <td className="px-6 py-4 font-medium text-black dark:text-white">
                    <div>
                      <div className="font-semibold text-black dark:text-white">{prod.title}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        {prod.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-[10px]">
                    {prod.categories?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 font-mono text-black dark:text-white font-semibold">
                    ${prod.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(prod)}
                      className={`focus:outline-none transition-colors cursor-pointer ${
                        prod.featured
                          ? "text-yellow-500"
                          : "text-neutral-700 hover:text-neutral-500"
                      }`}
                    >
                      <Star size={14} fill={prod.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`inline-flex items-center space-x-1.5 focus:outline-none cursor-pointer ${
                        prod.active ? "text-black dark:text-white" : "text-neutral-600"
                      }`}
                    >
                      {prod.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span className="text-[10px] font-semibold tracking-wider uppercase">
                        {prod.active ? "Active" : "Disabled"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="inline-block text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white transition-colors focus:outline-none cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <button
                      onClick={() => handleOpenDelete(prod.id)}
                      className="text-neutral-500 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? This action is irreversible."
        actionText="Delete"
        onAction={handleDelete}
        actionLoading={deleteLoading}
        danger
      />
    </div>
  );
}
