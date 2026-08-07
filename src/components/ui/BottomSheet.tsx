"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6" role="dialog" aria-modal="true" aria-label={title}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-lg md:max-w-3xl bg-white dark:bg-neutral-950 border-t md:border border-neutral-200 dark:border-neutral-850 rounded-t-2xl md:rounded-2xl animate-slide-up-sheet md:animate-fade-in max-h-[92vh] md:max-h-[85vh] flex flex-col safe-area-bottom shadow-2xl">
        {/* Handle bar */}
        <div className="flex-shrink-0 pt-3 pb-1 flex justify-center md:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 md:py-5 border-b border-neutral-100 dark:border-neutral-900">
          <h2 className="font-serif-luxury text-lg tracking-wider uppercase font-medium text-black dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
            aria-label="Close sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
