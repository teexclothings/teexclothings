"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  actionText?: string;
  onAction?: () => void | Promise<void>;
  actionLoading?: boolean;
  danger?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actionText,
  onAction,
  actionLoading = false,
  danger = false,
}: ModalProps) {
  // Close on Escape keypress and lock body scroll
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl animate-fade-in rounded-sm max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h3 className="font-serif-luxury text-lg tracking-wider uppercase font-medium">{title}</h3>
        {description && (
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed font-light">{description}</p>
        )}

        <div className="mt-4">{children}</div>

        {(onAction || actionText) && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              disabled={actionLoading}
              className="w-full sm:w-auto border border-neutral-800 bg-neutral-950 px-4 py-2 text-[10px] uppercase tracking-widest hover:border-neutral-500 hover:bg-neutral-900 transition-all font-light rounded-sm"
            >
              Cancel
            </button>
            {onAction && (
              <button
                onClick={onAction}
                disabled={actionLoading}
                className={`w-full sm:w-auto px-4 py-2 text-[10px] uppercase tracking-widest font-medium transition-all rounded-sm ${
                  danger
                    ? "bg-red-950 text-red-500 border border-red-800 hover:bg-red-900"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {actionLoading ? "Processing..." : actionText || "Confirm"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
