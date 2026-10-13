export default function NewsLoading() {
  return (
    <div className="animate-pulse">
      {/* Skeleton Banner */}
      <div className="relative bg-muted px-[9.8264%] py-16 text-center">
        <div className="mx-auto h-10 w-3/4 max-w-md rounded-md bg-muted-foreground/20" />
        <div className="mx-auto mt-4 h-6 w-1/2 max-w-xs rounded-md bg-muted-foreground/20" />
      </div>

      {/* Skeleton Container matching max-w-7xl */}
      <div className="px-section py-8 md:py-12 lg:py-16 max-w-7xl mx-auto">
        {/* Category Pills & Search Controls Bar Skeleton */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/70 pb-6">
          <div className="flex items-center gap-2 overflow-x-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-slate-200/70" />
            ))}
          </div>
          <div className="h-10 w-full sm:w-72 rounded-lg bg-slate-200/70" />
        </div>

        {/* Featured Card Skeleton */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200/70 bg-white lg:grid lg:grid-cols-12">
          <div className="aspect-16/10 w-full bg-slate-200/70 lg:col-span-7 lg:min-h-[380px]" />
          <div className="p-7 sm:p-9 lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-4 w-32 rounded bg-slate-200/70" />
              <div className="h-8 w-4/5 rounded bg-slate-200/80" />
              <div className="h-4 w-full rounded bg-slate-200/60" />
              <div className="h-4 w-5/6 rounded bg-slate-200/60" />
            </div>
            <div className="h-4 w-28 rounded bg-slate-200/70 pt-2" />
          </div>
        </div>

        {/* 2-Column Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white"
            >
              <div className="aspect-16/10 w-full bg-slate-200/70" />
              <div className="flex-1 p-6 space-y-3">
                <div className="h-3.5 w-28 rounded bg-slate-200/70" />
                <div className="h-6 w-3/4 rounded bg-slate-200/80" />
                <div className="h-4 w-full rounded bg-slate-200/60" />
                <div className="h-4 w-4/5 rounded bg-slate-200/60" />
                <div className="h-4 w-24 rounded bg-slate-200/70 pt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
