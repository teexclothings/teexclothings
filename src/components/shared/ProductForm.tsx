"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import MediaUpload from "@/components/ui/MediaUpload";
import CustomSelect from "@/components/ui/CustomSelect";
import { FormSkeleton } from "@/components/ui/Skeletons";
import { Save, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  productId?: string;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  // Tag inputs
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const isEditing = !!productId;

  const loadData = React.useCallback(async () => {
    setLoading(true);

    // Fetch active categories
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name")
      .eq("active", true);
    setCategories(catData || []);

    if (isEditing && productId) {
      // Fetch current product details
      const { data: prod, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        showToast(error.message, "error");
        router.push("/admin/products");
        return;
      }

      if (prod) {
        setTitle(prod.title);
        setSlug(prod.slug);
        setDescription(prod.description || "");
        setOriginalPrice(prod.original_price !== undefined && prod.original_price !== null ? prod.original_price.toString() : (prod as unknown as { price: number }).price?.toString() || "");
        setSellingPrice(prod.selling_price !== null && prod.selling_price !== undefined ? prod.selling_price.toString() : "");
        setIsOutOfStock(!!prod.is_out_of_stock);
        setCategoryId(prod.category_id);
        setSizes(prod.sizes || []);
        setColors(prod.colors || []);
        setImages(prod.images || []);
        setFeatured(prod.featured);
        setActive(prod.active);
      }
    }
    setLoading(false);
  }, [productId, isEditing, router, showToast, supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  // Add Size Tag
  const handleAddSize = (val: string) => {
    const clean = val.trim().toUpperCase();
    if (!clean) return;
    if (sizes.includes(clean)) {
      showToast("Size already added.", "error");
      return;
    }
    setSizes((prev) => [...prev, clean]);
    setSizeInput("");
  };

  const handleRemoveSize = (val: string) => {
    setSizes((prev) => prev.filter((s) => s !== val));
  };

  // Add Color Tag
  const handleAddColor = (val: string) => {
    const clean = val.trim();
    if (!clean) return;
    if (colors.includes(clean)) {
      showToast("Color already added.", "error");
      return;
    }
    setColors((prev) => [...prev, clean]);
    setColorInput("");
  };

  const handleRemoveColor = (val: string) => {
    setColors((prev) => prev.filter((c) => c !== val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const origPriceNum = parseFloat(originalPrice);
    const sellingPriceNum = sellingPrice.trim() !== "" ? parseFloat(sellingPrice) : null;

    if (!title || !slug || isNaN(origPriceNum) || origPriceNum < 0 || !categoryId) {
      showToast("Please fill all required fields correctly.", "error");
      return;
    }

    if (sellingPriceNum !== null && (isNaN(sellingPriceNum) || sellingPriceNum < 0)) {
      showToast("Please enter a valid selling price.", "error");
      return;
    }

    if (sellingPriceNum !== null && sellingPriceNum >= origPriceNum) {
      showToast("Selling price should be strictly lower than original price.", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one product image.", "error");
      return;
    }

    setSaving(true);

    const productData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      original_price: origPriceNum,
      selling_price: sellingPriceNum,
      is_out_of_stock: isOutOfStock,
      category_id: categoryId,
      sizes,
      colors,
      images,
      featured,
      active,
    };

    if (isEditing && productId) {
      const { error } = await supabase.from("products").update(productData).eq("id", productId);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Product updated successfully.", "success");
        router.push("/admin/products");
      }
    } else {
      // Check duplicate slug
      const { data: check } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug.trim())
        .maybeSingle();

      if (check) {
        showToast("A product with this URL slug already exists.", "error");
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Product created successfully.", "success");
        router.push("/admin/products");
      }
    }

    setSaving(false);
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl select-none animate-fade-in pb-16">
      {/* Identity block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
          Product Details
        </h2>

        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Oversized Knit Sweater"
            className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            URL Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="e.g. oversized-knit-sweater"
            className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 font-mono text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe craftsmanship, stitching, fit layout and material composition details..."
            className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Original Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 1299.00"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Selling Price (₹) <span className="text-neutral-500 font-normal">(Optional Offer)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="e.g. 899.00"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase mb-1">
              Category Placement <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={categoryId}
              onChange={(val) => setCategoryId(val)}
              placeholder="Select Category"
              className="w-full"
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Sizing & Colors block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
          Attributes Configuration
        </h2>

        {/* Sizes */}
        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase mb-1">
            Sizes
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {sizes.map((s) => (
              <span
                key={s}
                className="flex items-center space-x-1 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 px-2 py-1 text-[9px] font-mono font-semibold uppercase text-black dark:text-white rounded-sm"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(s)}
                  className="text-neutral-500 hover:text-black dark:text-white focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize(sizeInput))}
              placeholder="Type custom size (e.g. S, Custom-Fit)"
              className="flex-1 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-xs text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddSize(sizeInput)}
              className="flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white hover:border-neutral-500 px-4 py-2 rounded-sm focus:outline-none cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[9px] tracking-wider uppercase text-neutral-600 self-center mr-1">
              Suggestions:
            </span>
            {DEFAULT_SIZES.map((ds) => (
              <button
                key={ds}
                type="button"
                onClick={() => handleAddSize(ds)}
                className="bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white px-2 py-1 text-[8px] tracking-wider uppercase font-semibold rounded-sm focus:outline-none cursor-pointer"
              >
                {ds}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase mb-1">
            Colors
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map((c) => (
              <span
                key={c}
                className="flex items-center space-x-1 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 px-2.5 py-1 text-[9px] uppercase tracking-widest font-semibold text-black dark:text-white rounded-sm"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(c)}
                  className="text-neutral-500 hover:text-black dark:text-white focus:outline-none cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddColor(colorInput))
              }
              placeholder="Type color (e.g. Jet Black, #000000)"
              className="flex-1 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-xs text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddColor(colorInput)}
              className="flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white hover:border-neutral-500 px-4 py-2 rounded-sm focus:outline-none cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Media Upload block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-6">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
          Product Images (Upload at least one)
        </h2>

        <MediaUpload
          bucket="products"
          multiple
          value={images}
          onChange={(val) => setImages((val as string[]) || [])}
        />
      </div>

      {/* Visibility Flags block */}
      <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-4">
        <h2 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-850 pb-2">
          Visibility & Inventory Status
        </h2>

        {/* Modern Toggle Switch for Out of Stock */}
        <div className="flex items-center justify-between py-1">
          <div className="space-y-0.5">
            <label
              htmlFor="prod-out-of-stock"
              className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer block"
            >
              Out of Stock Status
            </label>
            <p className="text-[10px] text-neutral-500 font-light">
              Toggle ON to mark product as Out of Stock (disables purchasing on storefront)
            </p>
          </div>
          <button
            id="prod-out-of-stock"
            type="button"
            role="switch"
            aria-checked={isOutOfStock}
            onClick={() => setIsOutOfStock(!isOutOfStock)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isOutOfStock ? "bg-red-600" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isOutOfStock ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center">
          <input
            id="prod-featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
          />
          <label
            htmlFor="prod-featured"
            className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
          >
            Mark product as Best Seller (displays BEST SELLER badge & filter option)
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="prod-active"
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
          />
          <label
            htmlFor="prod-active"
            className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
          >
            Product is active (visible to storefront catalogs)
          </label>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            if (confirm("Discard all unsaved changes?")) router.push("/admin/products");
          }}
          className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white hover:border-neutral-500 px-6 py-3 text-xs uppercase tracking-widest transition-all rounded-sm focus:outline-none cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-white text-black px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-700 dark:text-neutral-300 rounded-sm select-none"
        >
          <Save size={14} />
          <span>{saving ? "Saving Product..." : "Save Product"}</span>
        </button>
      </div>
    </form>
  );
}
