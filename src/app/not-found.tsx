import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between items-center px-6 py-12 select-none animate-fade-in">
      {/* Header spacer */}
      <div className="w-full max-w-5xl">
        <Link href="/" className="font-serif-luxury text-xl tracking-[0.25em] uppercase text-white">
          TEEX
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-md space-y-6">
        <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase font-light">
          Error 404
        </span>
        <h1 className="font-serif-luxury text-4xl font-light tracking-widest text-white uppercase sm:text-5xl">
          Page Not Found
        </h1>
        <div className="h-[1px] w-12 bg-neutral-800" />
        <p className="text-xs text-neutral-400 font-light leading-relaxed tracking-wide">
          The collection silhouette or coordinate path you are looking for does not exist or has been
          archived.
        </p>

        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 border border-white bg-white px-6 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-black transition-all hover:bg-transparent hover:text-white rounded-sm focus:outline-none"
          >
            <span>Browse Catalog</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </main>

      {/* Footer spacer */}
      <footer className="w-full max-w-5xl text-center text-[9px] tracking-widest uppercase text-neutral-600 font-light">
        © {new Date().getFullYear()} TEEX CLOTHINGS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
