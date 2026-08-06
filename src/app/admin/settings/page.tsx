"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormSkeleton } from "@/components/ui/Skeletons";
import MediaUpload from "@/components/ui/MediaUpload";
import { useToast } from "@/context/ToastContext";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  // Settings State
  const [shopName, setShopName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [address, setAddress] = useState("");

  const fetchSettings = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      showToast(error.message, "error");
    } else if (data) {
      setShopName(data.shop_name);
      setLogo(data.logo);
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setWhatsapp(data.whatsapp || "");
      setInstagram(data.instagram || "");
      setFacebook(data.facebook || "");
      setAddress(data.address || "");
    }
    setLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSettings();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName) {
      showToast("Shop name is required.", "error");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("settings").upsert({
      id: true,
      shop_name: shopName,
      logo,
      email: email || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      instagram: instagram || null,
      facebook: facebook || null,
      address: address || null,
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Settings saved successfully.", "success");
    }
    setSaving(false);
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div className="border-b border-neutral-850 pb-6">
        <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
          Global Config
        </span>
        <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
          Website Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <div className="rounded-sm border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Brand Identity
          </h2>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase mb-1">
              Shop Logo
            </label>
            <MediaUpload
              bucket="settings"
              value={logo}
              onChange={(val) => setLogo(val as string | null)}
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
              Shop Name
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. TEEX CLOTHINGS"
              className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-sm border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Public Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@teex.com"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Public Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555 123 4567"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
              WhatsApp Number (For Purchasing Redirects)
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="e.g. 15551234567 (Digits only, include country code)"
              className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-sm text-white focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
              Physical Shop Address
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Fashion Ave, Suite 456, New York, NY"
              className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-sm border border-neutral-800 bg-neutral-900/50 p-6 space-y-6">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Social Media Channels
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/teex"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/teex"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-white text-black px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-300 rounded-sm select-none"
        >
          <Save size={14} />
          <span>{saving ? "Saving Changes..." : "Save Config"}</span>
        </button>
      </form>
    </div>
  );
}
