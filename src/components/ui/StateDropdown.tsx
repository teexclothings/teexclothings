"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { ChevronDown, Search, Loader2 } from "lucide-react";

interface ShippingState {
  id: string;
  state_name: string;
  shipping_charge: number;
}

interface StateDropdownProps {
  value: string;
  onChange: (stateName: string, shippingCharge: number) => void;
  error?: string;
}

export default function StateDropdown({ value, onChange, error }: StateDropdownProps) {
  const [states, setStates] = useState<ShippingState[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchStates() {
      try {
        const supabase = createClient();
        const { data, error: err } = await supabase
          .from("shipping_charges")
          .select("id, state_name, shipping_charge")
          .eq("is_active", true)
          .order("state_name", { ascending: true });

        if (err) throw err;
        setStates(data || []);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStates();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      // Focus search input when opened
      setTimeout(() => searchRef.current?.focus(), 100);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = states.filter((s) =>
    s.state_name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSelect(state: ShippingState) {
    onChange(state.state_name, state.shipping_charge);
    setOpen(false);
    setSearch("");
  }

  if (loading) {
    return (
      <div className="space-y-1.5">
        <span className="block text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          State
        </span>
        <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 rounded-sm px-4 py-3">
          <Loader2 size={14} className="animate-spin text-neutral-500" />
          <span className="text-xs text-neutral-600 font-light">Loading states…</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="space-y-1.5">
        <span className="block text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          State
        </span>
        <div className="bg-neutral-900 border border-red-900 rounded-sm px-4 py-3">
          <span className="text-xs text-red-400 font-light">Failed to load states. Please refresh.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="block text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
        State
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`w-full flex items-center justify-between bg-neutral-900 border rounded-sm px-4 py-3 text-sm font-light tracking-wide transition-colors cursor-pointer focus:outline-none focus:border-white ${
          error ? "border-red-800" : "border-neutral-800 hover:border-neutral-600"
        } ${value ? "text-white" : "text-neutral-600"}`}
      >
        <span>{value || "Select your state"}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {error && (
        <p className="text-[10px] text-red-400 font-light tracking-wide" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-900 border border-neutral-800 rounded-sm shadow-2xl animate-fade-in max-h-60 flex flex-col">
          {/* Search */}
          <div className="flex items-center space-x-2 px-3 py-2 border-b border-neutral-800">
            <Search size={12} className="text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search state…"
              className="flex-1 bg-transparent text-xs text-white placeholder-neutral-600 outline-none"
            />
          </div>

          {/* Options */}
          <ul className="overflow-y-auto flex-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-neutral-500 font-light">No states found</li>
            ) : (
              filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === s.state_name}
                    onClick={() => handleSelect(s)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-light tracking-wide transition-colors cursor-pointer hover:bg-neutral-800 ${
                      value === s.state_name ? "text-white bg-neutral-800" : "text-neutral-400"
                    }`}
                  >
                    <span>{s.state_name}</span>
                    <span className="float-right text-neutral-600">₹{s.shipping_charge.toFixed(2)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
