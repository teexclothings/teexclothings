"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering once client is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 flex-shrink-0" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-1.5 focus:outline-none cursor-pointer text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors active:animate-scale-tap rounded-sm flex items-center justify-center flex-shrink-0"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon size={17} strokeWidth={2} />
      ) : (
        <Sun size={17} strokeWidth={2} />
      )}
    </button>
  );
}
