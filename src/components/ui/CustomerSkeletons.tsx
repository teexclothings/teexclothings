

export function CustomerHeroSkeleton() {
  return (
    <div className="relative w-full aspect-[21/9] min-h-[350px] bg-neutral-900 animate-pulse flex items-center justify-center">
      <div className="text-center space-y-3 px-6 max-w-lg">
        <div className="h-4 bg-neutral-800 w-1/3 mx-auto rounded-sm" />
        <div className="h-10 bg-neutral-850 w-3/4 mx-auto rounded-sm" />
        <div className="h-4 bg-neutral-800 w-2/3 mx-auto rounded-sm" />
      </div>
    </div>
  );
}

export function CustomerCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-[3/4] w-full bg-neutral-900 rounded-sm" />
      <div className="space-y-2">
        <div className="h-3 bg-neutral-850 w-1/4 rounded-sm" />
        <div className="h-4 bg-neutral-800 w-3/4 rounded-sm" />
        <div className="h-3 bg-neutral-850 w-1/5 rounded-sm" />
      </div>
    </div>
  );
}

export function CustomerGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CustomerPillSkeleton() {
  return (
    <div className="flex space-x-2 animate-pulse overflow-hidden py-1 select-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-8 bg-neutral-900 w-24 rounded-full flex-shrink-0" />
      ))}
    </div>
  );
}

export function CustomerDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse">
      <div className="space-y-4">
        <div className="aspect-[3/4] w-full bg-neutral-900 rounded-sm" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-900 rounded-sm" />
          ))}
        </div>
      </div>
      <div className="space-y-6 self-center">
        <div className="space-y-3">
          <div className="h-3 bg-neutral-850 w-1/4 rounded-sm" />
          <div className="h-10 bg-neutral-800 w-3/4 rounded-sm" />
          <div className="h-4 bg-neutral-800 w-1/3 rounded-sm" />
        </div>
        <div className="h-[1px] bg-neutral-850" />
        <div className="space-y-2">
          <div className="h-3 bg-neutral-850 w-1/6 rounded-sm" />
          <div className="h-24 bg-neutral-900 rounded-sm" />
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-neutral-850 w-1/6 rounded-sm" />
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-12 bg-neutral-900 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="h-12 bg-neutral-800 w-full rounded-sm" />
      </div>
    </div>
  );
}
