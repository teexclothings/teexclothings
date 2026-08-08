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
  mobile_media_url?: string | null;
  mobile_media_type?: "image" | "video" | null;
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
  const [mediaTab, setMediaTab] = useState<"desktop" | "mobile">("desktop");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState<string | null>(null);
  const [formMediaType, setFormMediaType] = useState<"image" | "video">("image");
  const [formMobileMediaUrl, setFormMobileMediaUrl] = useState<string | null>(null);
  const [formMobileMediaType, setFormMobileMediaType] = useState<"image" | "video">("image");
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
    setMediaTab("desktop");
    setFormTitle("");
    setFormSubtitle("");
    setFormMediaUrl(null);
    setFormMediaType("image");
    setFormMobileMediaUrl(null);
    setFormMobileMediaType("image");
    setFormButtonText("");
    setFormButtonLink("");
    setFormActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setIsEditing(true);
    setSelectedId(banner.id);
    setMediaTab("desktop");
    setFormTitle(banner.title || "");
    setFormSubtitle(banner.subtitle || "");
    setFormMediaUrl(banner.media_url);
    setFormMediaType(banner.media_type);
    setFormMobileMediaUrl(banner.mobile_media_url || null);
    setFormMobileMediaType(banner.mobile_media_type || "image");
    setFormButtonText(banner.button_text || "");
    setFormButtonLink(banner.button_link || "");
    setFormActive(banner.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMediaUrl) {
      showToast("Desktop media file is required.", "error");
      return;
    }

    setFormLoading(true);

    const bannerData = {
      title: formTitle.trim() || null,
      subtitle: formSubtitle.trim() || null,
      media_url: formMediaUrl,
      media_type: formMediaType,
      mobile_media_url: formMobileMediaUrl || null,
      mobile_media_type: formMobileMediaUrl ? formMobileMediaType : null,
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

  const handleMobileMediaChange = (val: string | string[] | null) => {
    const url = val as string | null;
    setFormMobileMediaUrl(url);
    if (url) {
      const isVideo =
        url.endsWith(".mp4") || url.endsWith(".mov") || url.includes("video/quicktime");
      setFormMobileMediaType(isVideo ? "video" : "image");
    }
  };

  const filtered = banners.filter(
    (b) =>
      (b.title && b.title.toLowerCase().includes(search.toLowerCase())) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-neutral-850 pb-6 sm:flex-row sm:items-center sm:justify-between">
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
          className="flex cursor-pointer items-center justify-center space-x-2 bg-black dark:bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white dark:text-black transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm select-none"
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
            className="w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-10 py-2.5 text-xs tracking-wider uppercase text-black dark:text-white placeholder-neutral-600 focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-50 dark:bg-neutral-900/30 p-12 text-center">
            <ImageIcon className="mx-auto text-neutral-700 mb-4" size={40} />
            <h3 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
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
                className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-video w-full border-b border-neutral-200 dark:border-neutral-850 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden">
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

                  <div className="absolute top-2 left-2 flex space-x-1">
                    <span className="bg-black/80 backdrop-blur-sm border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-[8px] font-semibold tracking-wider text-white uppercase rounded-xs">
                      Desktop
                    </span>
                    {banner.mobile_media_url ? (
                      <span className="bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 text-[8px] font-semibold tracking-wider text-emerald-300 uppercase rounded-xs">
                        Mobile Custom
                      </span>
                    ) : (
                      <span className="bg-black/60 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[8px] font-light tracking-wider text-neutral-600 dark:text-neutral-400 uppercase rounded-xs">
                        Mobile Fallback
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 flex space-x-1.5">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      title={banner.active ? "Active" : "Disabled"}
                      className={`p-1.5 rounded-sm focus:outline-none shadow-md cursor-pointer ${
                        banner.active
                          ? "bg-white text-emerald-600 dark:bg-neutral-900 dark:text-emerald-400"
                          : "bg-white text-red-600 dark:bg-neutral-900 dark:text-red-400 border border-neutral-200 dark:border-neutral-800"
                      }`}
                    >
                      {banner.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold tracking-widest text-black dark:text-white uppercase">
                      {banner.title || "Untitled Banner"}
                    </h3>
                    {banner.subtitle && (
                      <p className="mt-1 text-xs font-light text-neutral-600 dark:text-neutral-400 truncate">
                        {banner.subtitle}
                      </p>
                    )}

                    {banner.button_text && (
                      <div className="mt-3 inline-flex items-center space-x-1 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-2.5 py-1 text-[9px] font-medium tracking-widest text-neutral-600 dark:text-neutral-400 uppercase rounded-sm">
                        <span>{banner.button_text}</span>
                        {banner.button_link && <ExternalLink size={8} />}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-850">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="flex cursor-pointer items-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-1.5 text-[9px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:border-neutral-500 rounded-sm focus:outline-none"
                    >
                      <Edit2 size={10} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(banner.id)}
                      className="flex cursor-pointer items-center border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 text-[9px] uppercase tracking-widest text-red-700 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-900 dark:hover:text-red-100 rounded-sm focus:outline-none"
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
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* Tabbed Media Selection */}
          <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-850 pb-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Banner Media Asset *
              </label>
              <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-sm border border-neutral-200 dark:border-neutral-850 text-[9px] font-semibold tracking-wider uppercase">
                <button
                  type="button"
                  onClick={() => setMediaTab("desktop")}
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                    mediaTab === "desktop"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white"
                  }`}
                >
                  Desktop {formMediaUrl ? "✓" : "*"}
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab("mobile")}
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                    mediaTab === "mobile"
                      ? "bg-white text-black font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white"
                  }`}
                >
                  Mobile {formMobileMediaUrl ? "✓" : "(Optional)"}
                </button>
              </div>
            </div>

            {mediaTab === "desktop" ? (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">Desktop View Media</span>
                  <span className="text-neutral-600 dark:text-neutral-400 font-light">Recommended size: <strong className="text-black dark:text-white font-medium">1920 × 900 px</strong></span>
                </div>
                <MediaUpload
                  bucket="banners"
                  value={formMediaUrl}
                  onChange={handleMediaChange}
                  accept="image/png, image/jpeg, image/webp, video/mp4"
                />
              </div>
            ) : (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">Mobile View Media</span>
                  <span className="text-neutral-600 dark:text-neutral-400 font-light">Recommended size: <strong className="text-black dark:text-white font-medium">1080 × 1350 px</strong></span>
                </div>
                <MediaUpload
                  bucket="banners"
                  value={formMobileMediaUrl}
                  onChange={handleMobileMediaChange}
                  accept="image/png, image/jpeg, image/webp, video/mp4"
                />
                <p className="text-[10px] text-neutral-500 font-light pt-1">
                  * If left blank, your Desktop banner will automatically be used on mobile devices.
                </p>
              </div>
            )}
          </div>

          {/* Copy Content Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Badge / Tag (e.g. NEW DROP)
              </label>
              <input
                type="text"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="e.g. NEW DROP"
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-xs text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
                Headline Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. PREMIUM STREETWEAR"
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-xs text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Description / Subtitle
            </label>
            <input
              type="text"
              value={formButtonText}
              onChange={(e) => setFormButtonText(e.target.value)}
              placeholder="e.g. Minimal designs. Maximum impact."
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-xs text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center pt-1">
            <input
              id="banner-active"
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
            />
            <label
              htmlFor="banner-active"
              className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              Banner is active (visible on homepage carousel)
            </label>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full cursor-pointer bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-250 disabled:bg-neutral-600 disabled:text-neutral-700 dark:text-neutral-300 rounded-sm mt-3"
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
