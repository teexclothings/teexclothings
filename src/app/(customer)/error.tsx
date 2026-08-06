"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log details internally for production diagnostic tracing
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center space-y-6 flex-1 flex flex-col justify-center select-none animate-fade-in">
      <div className="flex justify-center text-neutral-500">
        <AlertOctagon size={48} />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif-luxury text-2xl font-light tracking-wide text-white uppercase">
          An Error Occurred
        </h1>
        <p className="text-xs text-neutral-400 font-light leading-relaxed">
          We encountered a connection issue while fetching our tailored catalog details. Please try
          again.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex cursor-pointer items-center justify-center space-x-2 border border-white bg-white px-6 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-black transition-all hover:bg-transparent hover:text-white rounded-sm focus:outline-none"
        >
          <RotateCcw size={12} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
