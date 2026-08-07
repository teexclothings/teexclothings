import { createClient } from "@/utils/supabase/server";
import ProductsClient from "@/app/(customer)/products/ProductsClient";

export const revalidate = 0;

export default async function ProductsPage() {
  const supabase = await createClient();

  // Fetch active categories (First added first)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <ProductsClient
      initialCategories={categories || []}
      initialProducts={products || []}
    />
  );
}
