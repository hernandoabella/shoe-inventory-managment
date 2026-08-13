export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-xl bg-gray-200 lg:col-span-2" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
      <div className="h-48 rounded-xl bg-gray-200" />
    </div>
  );
}

export default DashboardSkeleton;
