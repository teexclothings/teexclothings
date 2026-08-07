import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | TEEX",
  description:
    "Learn about our design ethos, premium tailoring craft, and timeless minimalist collections.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 space-y-12 flex-1 flex flex-col justify-center select-none">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase font-light">
          Our Philosophy
        </span>
        <h1 className="font-serif-luxury text-4xl font-light tracking-widest text-black dark:text-white uppercase sm:text-5xl">
          Craft & Silhouettes
        </h1>
        <div className="mx-auto h-[1px] w-12 bg-neutral-300 dark:bg-neutral-800 mt-4" />
      </div>

      {/* Copy block */}
      <div className="space-y-6 text-neutral-600 dark:text-neutral-300 text-xs font-light leading-relaxed tracking-wide">
        <p>
          Founded on the principles of extreme simplicity and premium utility, TEEX CLOTHINGS represents
          a contemporary perspective on daily tailoring. We reject the rapid cycles of fast fashion in
          favor of silhouettes that endure.
        </p>
        <p>
          Every piece is designed with meticulous attention to detail. From selecting heavyweight, low-tension
          knits to choosing custom double-stitched reinforced borders, our process is defined by an absolute focus
          on fabric composition and natural draping parameters.
        </p>
        <p>
          We construct collections designed to integrate fluidly into the modern wardrobe. Our garments are
          manufactured in limited quantities to eliminate excess production, emphasizing responsible, slow,
          artisan-level tailoring.
        </p>
      </div>

      {/* Aesthetic Image box placeholder */}
      <div className="relative aspect-[21/9] w-full border border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950/40 rounded-sm flex items-center justify-center">
        <span className="text-[9px] tracking-[0.25em] text-neutral-500 dark:text-neutral-450 uppercase font-semibold">
          Tailored Minimalist Aesthetics
        </span>
      </div>
    </div>
  );
}
