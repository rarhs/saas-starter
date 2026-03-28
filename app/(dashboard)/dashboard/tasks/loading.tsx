function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className || ''}`} />;
}

export default function TasksLoading() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <div className="border rounded-xl p-6 mb-6">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-[150px] rounded-md" />
          <Skeleton className="h-10 w-[150px] rounded-md" />
          <Skeleton className="h-10 w-[180px] rounded-md" />
        </div>
      </div>
      <div className="border rounded-xl p-6">
        <Skeleton className="h-5 w-20 mb-4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-48 flex-shrink-0" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
