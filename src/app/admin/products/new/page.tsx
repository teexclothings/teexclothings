
import ProductForm from "@/components/shared/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-850 pb-6">
        <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
          Catalog Inventory
        </span>
        <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
          Add New Product
        </h1>
      </div>
      <ProductForm />
    </div>
  );
}
