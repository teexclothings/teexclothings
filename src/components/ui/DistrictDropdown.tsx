"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { INDIA_STATES_DISTRICTS } from "@/utils/indiaStatesDistricts";

interface DistrictDropdownProps {
  value: string;
  state: string;
  onChange: (districtName: string) => void;
  error?: string;
}

export default function DistrictDropdown({ value, state, onChange, error }: DistrictDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const districts = state ? (INDIA_STATES_DISTRICTS[state] || []) : [];
  const isDisabled = !state || districts.length === 0;

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

  const filtered = districts.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(district: string) {
    onChange(district);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="block text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
        District
      </label>

      {/* Trigger */}
      <button
        id="delivery-district"
        type="button"
        onClick={() => !isDisabled && setOpen(!open)}
        disabled={isDisabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`w-full flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border rounded-sm px-4 py-3 text-sm font-light tracking-wide transition-colors focus:outline-none focus:border-black dark:focus:border-white ${
          isDisabled
            ? "border-neutral-200 dark:border-neutral-800 opacity-60 cursor-not-allowed text-neutral-400 dark:text-neutral-600"
            : error
            ? "border-red-800 dark:border-red-500 cursor-pointer"
            : "border-neutral-200 dark:border-neutral-850 hover:border-neutral-350 dark:hover:border-neutral-600 cursor-pointer"
        } ${value && !isDisabled ? "text-black dark:text-white" : "text-neutral-400 dark:text-neutral-600"}`}
      >
        <span>
          {value && !isDisabled
            ? value
            : state
            ? "Select your district"
            : "Select a state first"}
        </span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {error && (
        <p className="text-[10px] text-red-650 dark:text-red-400 font-light tracking-wide" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown panel */}
      {open && !isDisabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-2xl animate-fade-in max-h-60 flex flex-col">
          {/* Search */}
          <div className="flex items-center space-x-2 px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
            <Search size={12} className="text-neutral-500" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search district…"
              className="flex-1 bg-transparent text-xs text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 outline-none"
            />
          </div>

          {/* Options */}
          <ul className="overflow-y-auto flex-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-neutral-500 font-light">No districts found</li>
            ) : (
              filtered.map((d) => (
                <li key={d}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === d}
                    onClick={() => handleSelect(d)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-light tracking-wide transition-colors cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      value === d
                        ? "text-black dark:text-white bg-neutral-50 dark:bg-neutral-800 font-semibold"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {d}
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
