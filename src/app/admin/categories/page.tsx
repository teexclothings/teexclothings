"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Modal from "@/components/ui/Modal";
import MediaUpload from "@/components/ui/MediaUpload";
import { useToast } from "@/context/ToastContext";
import { Plus, Search, Trash2, Edit2, CheckCircle2, XCircle, FolderTree, Image as ImageIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const supabase = createClient();

  // Add/Edit Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [formActive, setFormActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Modal States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showToast(error.message, "error");
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  // Auto slugify name inputs
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormName(val);
    if (!isEditing) {
      setFormSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormName("");
    setFormSlug("");
    setFormImageUrl(null);
    setFormActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setIsEditing(true);
    setSelectedId(category.id);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormImageUrl(category.image_url);
    setFormActive(category.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) {
      showToast("Name and slug are required.", "error");
      return;
    }

    setFormLoading(true);

    if (isEditing && selectedId) {
      const { error } = await supabase
        .from("categories")
        .update({ name: formName, slug: formSlug, image_url: formImageUrl, active: formActive })
        .eq("id", selectedId);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Category updated successfully.", "success");
        setModalOpen(false);
        fetchCategories();
      }
    } else {
      const { data: check } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", formSlug)
        .maybeSingle();

      if (check) {
        showToast("A category with this slug already exists.", "error");
        setFormLoading(false);
        return;
      }

      const { error } = await supabase
        .from("categories")
        .insert([{ name: formName, slug: formSlug, image_url: formImageUrl, active: formActive }]);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Category created successfully.", "success");
        setModalOpen(false);
        fetchCategories();
      }
    }

    setFormLoading(false);
  };

  const handleToggleActive = async (category: Category) => {
    const { error } = await supabase
      .from("categories")
      .update({ active: !category.active })
      .eq("id", category.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast(`Category ${category.active ? "disabled" : "enabled"} successfully.`, "success");
      fetchCategories();
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const { error } = await supabase.from("categories").delete().eq("id", deleteId);

    if (error) {
      if (error.code === "23503") {
        showToast("Cannot delete category containing active products.", "error");
      } else {
        showToast(error.message, "error");
      }
    } else {
      showToast("Category deleted successfully.", "success");
      setDeleteOpen(false);
      fetchCategories();
    }

    setDeleteLoading(false);
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-neutral-850 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
            Collections Settings
          </span>
          <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
            Categories
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-black dark:bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black dark:text-white dark:text-black transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm select-none"
        >
          <Plus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="SEARCH CATEGORIES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-10 py-2.5 text-xs tracking-wider uppercase text-black dark:text-white placeholder-neutral-600 focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-50 dark:bg-neutral-900/30 p-12 text-center">
            <FolderTree className="mx-auto text-neutral-700 mb-4" size={40} />
            <h3 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              No categories found
            </h3>
            <p className="mt-1 text-xs font-light text-neutral-500">
              Create a new category to organize your catalog products.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 tracking-widest uppercase">
                  <th className="px-6 py-4 font-light">Image</th>
                  <th className="px-6 py-4 font-light">Name</th>
                  <th className="px-6 py-4 font-light">Slug</th>
                  <th className="px-6 py-4 text-center font-light">Status</th>
                  <th className="px-6 py-4 text-right font-light">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filtered.map((category) => (
                  <tr key={category.id} className="transition-colors hover:bg-neutral-100 dark:bg-neutral-800/20">
                    <td className="px-6 py-3">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-10 w-10 object-cover rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-600">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-black dark:text-white">{category.name}</td>
                    <td className="px-6 py-4 font-mono text-neutral-600 dark:text-neutral-400">{category.slug}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`inline-flex items-center space-x-1.5 focus:outline-none cursor-pointer ${
                          category.active ? "text-black dark:text-white" : "text-neutral-600"
                        }`}
                      >
                        {category.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span className="text-[10px] font-semibold tracking-wider uppercase">
                          {category.active ? "Active" : "Disabled"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEdit(category)}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white transition-colors focus:outline-none cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(category.id)}
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
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Category" : "Add Category"}
        description={
          isEditing
            ? "Modify your category details."
            : "Create a new category for products organizational layout."
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase mb-1">
              Category Image
            </label>
            <MediaUpload
              bucket="products"
              value={formImageUrl}
              onChange={(val) => setFormImageUrl(val as string | null)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Category Name
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={handleNameChange}
              placeholder="e.g. Graphic Tees"
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
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. graphic-tees"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 font-mono text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <input
              id="category-active"
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
            />
            <label
              htmlFor="category-active"
              className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              Category is active (visible to storefront)
            </label>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full cursor-pointer bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-700 dark:text-neutral-300 rounded-sm mt-4"
          >
            {formLoading ? "Saving..." : "Save Category"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Category"
        description="Are you sure you want to permanently delete this category? This action is irreversible."
        actionText="Delete"
        onAction={handleDelete}
        actionLoading={deleteLoading}
        danger
      />
    </div>
  );
}
