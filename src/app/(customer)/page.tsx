import { createClient } from "@/utils/supabase/server";
import HomeClient from "@/app/(customer)/HomeClient";

export const revalidate = 0; // Enforce dynamic data refresh on page entry

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch active hero banners (First added first)
  const { data: banners } = await supabase
    .from("hero_banners")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Fetch active categories (First added first)
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Fetch active products with category names
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  // Fetch admin settings for dynamic links (whatsapp, instagram, etc.)
  const { data: settings } = await supabase
    .from("settings")
    .select("whatsapp, instagram, facebook, phone, email, address")
    .eq("id", true)
    .maybeSingle();

  return (
    <HomeClient
      initialBanners={banners || []}
      initialCategories={categories || []}
      initialProducts={products || []}
      settings={settings}
    />
  );
}
