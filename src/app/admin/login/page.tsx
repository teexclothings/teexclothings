"use client";

import React, { useState, useTransition } from "react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await loginAction(formData);
      if (response?.error) {
        setError(response.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md space-y-8 border border-neutral-800 bg-neutral-900 p-8 rounded-sm shadow-2xl">
        <div className="text-center">
          <h2 className="font-serif-luxury text-3xl font-light tracking-widest uppercase">TEEX</h2>
          <p className="mt-2 text-xs tracking-[0.25em] text-neutral-400 uppercase">
            Admin Console Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="border border-neutral-800 bg-neutral-950 p-3 text-xs tracking-wide text-red-500 rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-light tracking-widest uppercase text-neutral-400"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                disabled={isPending}
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-600 transition-colors focus:border-white focus:outline-none"
                placeholder="admin@teexclothings.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-light tracking-widest uppercase text-neutral-400"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                disabled={isPending}
                className="mt-1 block w-full rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-600 transition-colors focus:border-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                disabled={isPending}
                className="h-4 w-4 accent-white"
                defaultChecked
              />
              <label htmlFor="remember" className="ml-2 font-light text-neutral-400">
                Remember session
              </label>
            </div>

            <div className="font-light">
              <a
                href="#forgot-password"
                onClick={() =>
                  alert("Password recovery is managed by the administrator in the Supabase console.")
                }
                className="text-neutral-400 transition-colors hover:text-white"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-sm bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-300"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
