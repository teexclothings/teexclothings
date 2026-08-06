"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

interface MediaUploadProps {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  bucket: "products" | "banners" | "settings";
  multiple?: boolean;
  accept?: string;
}

export default function MediaUpload({
  value,
  onChange,
  bucket,
  multiple = false,
  accept = "image/png, image/jpeg, image/webp",
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(10);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (error) {
        console.error("Storage upload error:", error);
        alert(`Failed to upload media: ${error.message}`);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);
      uploadedUrls.push(publicUrl);

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    if (multiple) {
      const current = Array.isArray(value) ? value : value ? [value as string] : [];
      onChange([...current, ...uploadedUrls]);
    } else {
      if (uploadedUrls[0]) {
        onChange(uploadedUrls[0]);
      }
    }

    setUploading(false);
    setProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((url) => url !== urlToRemove));
    } else {
      onChange(null);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const renderPreview = (url: string) => {
    const isVideo = url.endsWith(".mp4") || url.endsWith(".mov") || url.includes("video/quicktime");
    return (
      <div
        key={url}
        className="relative group border border-neutral-800 bg-neutral-950 p-2 rounded-sm w-32 h-32 flex items-center justify-center overflow-hidden"
      >
        {isVideo ? (
          <video src={url} className="object-cover w-full h-full" muted playsInline />
        ) : (
          <img src={url} alt="Media Preview" className="object-cover w-full h-full" />
        )}
        <button
          type="button"
          onClick={() => handleRemove(url)}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-all text-xs focus:outline-none"
        >
          DELETE
        </button>
      </div>
    );
  };

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className="space-y-4">
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-4">{urls.map((url) => renderPreview(url))}</div>
      )}

      {!multiple && urls.length === 1 ? null : (
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={triggerInput}
          className="border border-dashed border-neutral-800 hover:border-neutral-500 bg-neutral-900/50 p-8 rounded-sm text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 select-none"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={multiple}
            accept={accept}
            className="hidden"
          />

          <span className="text-xs text-neutral-400 tracking-wider">
            {uploading ? `Uploading ${progress}%...` : "DRAG & DROP MEDIA HERE OR CLICK TO BROWSE"}
          </span>

          {uploading && (
            <div className="w-full max-w-xs bg-neutral-950 h-[2px] rounded-full overflow-hidden mt-2 border border-neutral-800">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
