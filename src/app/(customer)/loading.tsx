import { CustomerHeroSkeleton, CustomerGridSkeleton } from "@/components/ui/CustomerSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl w-full px-6 py-12 space-y-16 animate-pulse select-none">
      <CustomerHeroSkeleton />
      <div className="space-y-4">
        <div className="h-6 bg-neutral-900 w-1/4 rounded-sm" />
        <CustomerGridSkeleton count={4} />
      </div>
    </div>
  );
}
