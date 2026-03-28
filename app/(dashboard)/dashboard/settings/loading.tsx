function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className || ''}`} />;
}

export default function SettingsLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <nav className="flex lg:flex-col gap-1 lg:w-48 shrink-0 p-2 lg:p-0">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
      </nav>
      <div className="flex-1 p-4 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-36" />
        <div className="border rounded-xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="border rounded-xl p-6 space-y-4">
          <Skeleton className="h-5 w-28" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
