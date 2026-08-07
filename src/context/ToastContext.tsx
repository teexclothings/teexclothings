"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Dynamic Toast rendering panel */}
      <div className="fixed bottom-4 right-4 z-[9999] w-full max-w-xs space-y-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between border px-4 py-3 text-[10px] font-medium tracking-widest uppercase rounded-sm shadow-xl transition-all duration-300 animate-slide-up ${
              toast.type === "success"
                ? "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 text-black dark:text-white"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-850 dark:text-red-400"
            }`}
          >
            <span className="flex-1 pr-2">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`hover:opacity-80 transition-opacity focus:outline-none ${
                toast.type === "success" ? "text-neutral-450 dark:text-neutral-500" : "text-red-650 dark:text-red-400"
              }`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
