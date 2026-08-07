import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import ProductsClient from "@/app/(customer)/products/ProductsClient";

export const revalidate = 0;

export default async function ProductsPage() {
  const supabase = await createClient();

  // Fetch active categories (First added first)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("active", true)
    .order("created_at", { ascending: true });

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-6 py-16 text-center text-xs text-neutral-500 uppercase tracking-widest">
        Loading Collection...
      </div>
    }>
      <ProductsClient
        initialCategories={categories || []}
        initialProducts={products || []}
      />
    </Suspense>
  );
}
