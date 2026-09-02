import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://teexclothing.in";

  const staticRoutes = ["", "/about", "/contact", "/products"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  try {
    const supabase = await createClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("active", true);

    if (error) {
      console.error("Supabase error fetching products for sitemap:", error);
    }

    if (products) {
      type Product = { slug: string; updated_at: string };
      const productRoutes = products.map((product: Product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
      }));

      return [...staticRoutes, ...productRoutes];
    }
  } catch (error) {
    console.error("Error generating product sitemap:", error);
  }

  return staticRoutes;
}
