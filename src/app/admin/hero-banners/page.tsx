"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Modal from "@/components/ui/Modal";
import MediaUpload from "@/components/ui/MediaUpload";
import { useToast } from "@/context/ToastContext";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

interface HeroBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  media_url: string;
  media_type: "image" | "video";
  button_text: string | null;
  button_link: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const supabase = createClient();

  // Add/Edit Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState<string | null>(null);
  const [formMediaType, setFormMediaType] = useState<"image" | "video">("image");
  const [formButtonText, setFormButtonText] = useState("");
  const [formButtonLink, setFormButtonLink] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Modal States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBanners = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showToast(error.message, "error");
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBanners();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchBanners]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormMediaUrl(null);
    setFormMediaType("image");
    setFormButtonText("");
    setFormButtonLink("");
    setFormActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setIsEditing(true);
    setSelectedId(banner.id);
    setFormTitle(banner.title || "");
    setFormSubtitle(banner.subtitle || "");
    setFormMediaUrl(banner.media_url);
    setFormMediaType(banner.media_type);
    setFormButtonText(banner.button_text || "");
    setFormButtonLink(banner.button_link || "");
    setFormActive(banner.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMediaUrl) {
      showToast("Media file is required.", "error");
      return;
    }

    setFormLoading(true);

    const bannerData = {
      title: formTitle.trim() || null,
      subtitle: formSubtitle.trim() || null,
      media_url: formMediaUrl,
      media_type: formMediaType,
      button_text: formButtonText.trim() || null,
      button_link: formButtonLink.trim() || null,
      active: formActive,
    };

    if (isEditing && selectedId) {
      const { error } = await supabase
        .from("hero_banners")
        .update(bannerData)
        .eq("id", selectedId);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Hero banner updated successfully.", "success");
        setModalOpen(false);
        fetchBanners();
      }
    } else {
      const { error } = await supabase.from("hero_banners").insert([bannerData]);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Hero banner created successfully.", "success");
        setModalOpen(false);
        fetchBanners();
      }
    }

    setFormLoading(false);
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    const { error } = await supabase
      .from("hero_banners")
      .update({ active: !banner.active })
      .eq("id", banner.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast(`Banner ${banner.active ? "disabled" : "enabled"} successfully.`, "success");
      fetchBanners();
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const { error } = await supabase.from("hero_banners").delete().eq("id", deleteId);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Banner deleted successfully.", "success");
      setDeleteOpen(false);
      fetchBanners();
    }

    setDeleteLoading(false);
  };

  const handleMediaChange = (val: string | string[] | null) => {
    const url = val as string | null;
    setFormMediaUrl(url);
    if (url) {
      const isVideo =
        url.endsWith(".mp4") || url.endsWith(".mov") || url.includes("video/quicktime");
      setFormMediaType(isVideo ? "video" : "image");
    }
  };

  const filtered = banners.filter(
    (b) =>
      (b.title && b.title.toLowerCase().includes(search.toLowerCase())) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-neutral-850 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
            Homepage Graphics
          </span>
          <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
            Hero Banners
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-200 rounded-sm select-none"
        >
          <Plus size={14} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="SEARCH BANNERS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-neutral-800 bg-neutral-900 px-10 py-2.5 text-xs tracking-wider uppercase text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-neutral-800 bg-neutral-900/30 p-12 text-center">
            <ImageIcon className="mx-auto text-neutral-700 mb-4" size={40} />
            <h3 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              No banners found
            </h3>
            <p className="mt-1 text-xs font-light text-neutral-500">
              Add homepage banners or loop videos to showcase your collection features.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {filtered.map((banner) => (
              <div
                key={banner.id}
                className="rounded-sm border border-neutral-800 bg-neutral-900 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-video w-full border-b border-neutral-850 bg-neutral-950 flex items-center justify-center overflow-hidden">
                  {banner.media_type === "video" ? (
                    <video
                      src={banner.media_url}
                      className="object-cover w-full h-full"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={banner.media_url}
                      alt={banner.title || ""}
                      className="object-cover w-full h-full"
                    />
                  )}

                  <div className="absolute top-2 right-2 flex space-x-1.5">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`p-1.5 rounded-sm focus:outline-none shadow-md cursor-pointer ${
                        banner.active
                          ? "bg-white text-black"
                          : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                      }`}
                    >
                      {banner.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold tracking-widest text-white uppercase">
                      {banner.title || "Untitled Banner"}
                    </h3>
                    {banner.subtitle && (
                      <p className="mt-1 text-xs font-light text-neutral-400 truncate">
                        {banner.subtitle}
                      </p>
                    )}

                    {banner.button_text && (
                      <div className="mt-3 inline-flex items-center space-x-1 border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[9px] font-medium tracking-widest text-neutral-400 uppercase rounded-sm">
                        <span>{banner.button_text}</span>
                        {banner.button_link && <ExternalLink size={8} />}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-850">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="flex cursor-pointer items-center border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-500 rounded-sm focus:outline-none"
                    >
                      <Edit2 size={10} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(banner.id)}
                      className="flex cursor-pointer items-center border border-red-950 bg-red-950/10 px-3 py-1.5 text-[9px] uppercase tracking-widest text-red-500 hover:bg-red-900 hover:text-white rounded-sm focus:outline-none"
                    >
                      <Trash2 size={10} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Banner" : "Add Banner"}
        description={
          isEditing ? "Modify your hero banner elements." : "Create a new visual display component."
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase mb-1">
              Banner Media (Image or Video)
            </label>
            <MediaUpload
              bucket="banners"
              value={formMediaUrl}
              onChange={handleMediaChange}
              accept="image/png, image/jpeg, image/webp, video/mp4"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
              Headline Title (Optional)
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. AUTUMN COLLECTION"
              className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              placeholder="e.g. Timeless silhouettes made for the season."
              className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Button Text (Optional)
              </label>
              <input
                type="text"
                value={formButtonText}
                onChange={(e) => setFormButtonText(e.target.value)}
                placeholder="e.g. SHOP NOW"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Button Link (Optional)
              </label>
              <input
                type="text"
                value={formButtonLink}
                onChange={(e) => setFormButtonLink(e.target.value)}
                placeholder="/products"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="banner-active"
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="h-4 w-4 accent-white cursor-pointer"
            />
            <label
              htmlFor="banner-active"
              className="ml-2 text-xs font-light text-neutral-400 cursor-pointer"
            >
              Banner is active (visible on homepage carousel)
            </label>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full cursor-pointer bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-250 disabled:bg-neutral-600 disabled:text-neutral-300 rounded-sm mt-4"
          >
            {formLoading ? "Saving..." : "Save Banner"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Banner"
        description="Are you sure you want to permanently delete this homepage hero banner? This action is irreversible."
        actionText="Delete"
        onAction={handleDelete}
        actionLoading={deleteLoading}
        danger
      />
    </div>
  );
}
