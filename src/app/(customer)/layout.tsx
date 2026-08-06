import React from "react";
import { createClient } from "@/utils/supabase/server";
import CustomerHeader from "@/components/layout/CustomerHeader";
import CustomerFooter from "@/components/layout/CustomerFooter";
import ScrollToTopButton from "@/app/(customer)/ScrollToTopButton";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Fetch settings singleton row on the server
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      <CustomerHeader settings={settings} />
      <main className="flex-1 flex flex-col">{children}</main>
      <CustomerFooter settings={settings} />
      <ScrollToTopButton />
    </div>
  );
}
