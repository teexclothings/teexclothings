import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/app/(customer)/products/[slug]/ProductDetailsClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, description")
    .eq("slug", slug)
    .maybeSingle();

  if (!product) return {};

  return {
    title: `${product.title} | TEEX`,
    description:
      product.description ||
      "Discover premium clothing silhouettes designed with ultimate focus on fabric, cut, and quality details.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("slug", slug)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  // Fetch similar products in the same category (limit 4)
  const { data: recommended } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  let finalRecommended = recommended || [];

  // Fallback to other active products if category is thin
  if (finalRecommended.length < 4) {
    const needed = 4 - finalRecommended.length;
    const excludeIds = [product.id, ...finalRecommended.map((p: { id: string }) => p.id)];
    const { data: fallback } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("active", true)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .limit(needed);
    if (fallback) {
      finalRecommended = [...finalRecommended, ...fallback];
    }
  }

  // Ensure strict uniqueness by product ID
  const uniqueRecommendedMap = new Map<string, typeof finalRecommended[number]>();
  for (const item of finalRecommended) {
    if (item && (item as { id: string }).id) {
      uniqueRecommendedMap.set((item as { id: string }).id, item);
    }
  }
  finalRecommended = Array.from(uniqueRecommendedMap.values());

  return (
    <ProductDetailsClient
      product={product}
      recommendedProducts={finalRecommended}
    />
  );
}
