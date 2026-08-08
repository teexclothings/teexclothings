"use client";

import { useState, useEffect } from "react";

/**
 * Premium splash/welcome animation for Teex Clothings.
 * Renders immediately (no flash), plays once per browser session.
 */
export default function SplashScreen() {
  // Start visible so the splash covers the page on first paint
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"letters" | "tagline" | "exit">("letters");

  useEffect(() => {
    // If already shown this session, dismiss immediately
    if (sessionStorage.getItem("teex_splash_shown")) {
      setShow(false);
      return;
    }

    // Timeline:
    //  0ms      – letters animate in (CSS stagger)
    //  1200ms   – tagline fades in
    //  2400ms   – mark as shown + begin exit fade
    //  3200ms   – unmount overlay
    const taglineTimer = setTimeout(() => setPhase("tagline"), 1200);
    const exitTimer = setTimeout(() => {
      sessionStorage.setItem("teex_splash_shown", "1");
      setPhase("exit");
    }, 2400);
    const unmountTimer = setTimeout(() => setShow(false), 3200);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!show) return null;

  const letters = ["T", "E", "E", "X"];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black transition-opacity duration-700 ease-out ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Decorative lines */}
      <div
        className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent transition-opacity duration-1000 ${
          phase === "letters" ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent transition-opacity duration-1000 ${
          phase === "letters" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* TEEX Letters */}
      <div className="flex items-center justify-center" aria-label="TEEX">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="splash-letter inline-block font-extrabold tracking-[0.15em] text-black dark:text-white uppercase select-none
              text-6xl sm:text-8xl md:text-9xl lg:text-[10rem]"
            style={{
              animationDelay: `${i * 150}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        className={`mt-4 sm:mt-6 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
          phase === "tagline" || phase === "exit"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3"
        }`}
      >
        Premium Clothing
      </p>

      {/* Animated underline accent */}
      <div
        className={`mt-4 sm:mt-6 h-[2px] bg-black dark:bg-white rounded-full transition-all duration-700 ease-out ${
          phase === "tagline" || phase === "exit" ? "w-16 sm:w-24 opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
