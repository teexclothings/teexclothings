"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormSkeleton } from "@/components/ui/Skeletons";
import MediaUpload from "@/components/ui/MediaUpload";
import { useToast } from "@/context/ToastContext";
import { Save, Key } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  // Profile data states
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!authLoading) {
      timer = setTimeout(() => {
        if (profile) {
          setFullName(profile.full_name || "");
          setAvatarUrl(profile.avatar_url);
        }
        setLoading(false);
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [profile, authLoading]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      showToast("Full name is required.", "error");
      return;
    }

    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Profile updated successfully.", "success");
      // Hard reload page context to sync layout avatars
      window.location.reload();
    }
    setSaving(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setPasswordSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Password updated successfully.", "success");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  };

  if (loading || authLoading) {
    return <FormSkeleton />;
  }

  const createdDate = profile ? new Date(profile.created_at).toLocaleDateString() : "";
  const updatedDate = profile ? new Date(profile.updated_at).toLocaleDateString() : "";

  return (
    <div className="space-y-6 select-none animate-fade-in">
      <div className="border-b border-neutral-850 pb-6">
        <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
          Admin Details
        </span>
        <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
          Administrator Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <form
            onSubmit={handleProfileSave}
            className="rounded-sm border border-neutral-800 bg-neutral-900/50 p-6 space-y-6"
          >
            <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Profile Metadata
            </h2>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase mb-1">
                Avatar Picture
              </label>
              <MediaUpload
                bucket="settings"
                value={avatarUrl}
                onChange={(val) => setAvatarUrl(val as string | null)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alexander McQueen"
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="mt-1 block w-full rounded-sm border border-neutral-850 bg-neutral-900/50 px-3 py-2 font-mono text-sm text-neutral-500 cursor-not-allowed select-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex cursor-pointer items-center justify-center space-x-2 bg-white text-black px-6 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-300 rounded-sm select-none"
            >
              <Save size={14} />
              <span>{saving ? "Saving..." : "Update Profile"}</span>
            </button>
          </form>

          <form
            onSubmit={handlePasswordSave}
            className="rounded-sm border border-neutral-800 bg-neutral-900/50 p-6 space-y-6"
          >
            <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Security Credentials
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-light tracking-widest text-neutral-400 uppercase">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="flex cursor-pointer items-center justify-center space-x-2 border border-neutral-800 bg-neutral-950 text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-widest hover:border-neutral-500 hover:bg-neutral-900 disabled:border-neutral-800 disabled:text-neutral-500 rounded-sm select-none"
            >
              <Key size={14} />
              <span>{passwordSaving ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        </div>

        <div className="rounded-sm border border-neutral-800 bg-neutral-900/50 p-6 space-y-6 h-fit">
          <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            System Details
          </h2>
          <div className="space-y-4 text-xs font-light text-neutral-300">
            <div className="flex justify-between border-b border-neutral-850 pb-2">
              <span className="text-neutral-500">Access Role:</span>
              <span className="font-semibold uppercase tracking-wider text-white">
                {profile?.role}
              </span>
            </div>
            <div className="flex justify-between border-b border-neutral-850 pb-2">
              <span className="text-neutral-500">Created Date:</span>
              <span>{createdDate}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-neutral-500">Last Modified:</span>
              <span>{updatedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
