import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
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

  return <ProductDetailsClient product={product || {}} />;
}
