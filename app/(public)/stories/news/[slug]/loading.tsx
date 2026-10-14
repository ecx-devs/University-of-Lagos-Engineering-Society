export default function NewsDetailLoading() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16 md:pt-10 md:pb-24">
      {/* Top Breadcrumb & Badge skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-5 w-44 rounded-lg bg-slate-200/80" />
        <div className="h-6 w-24 rounded-full bg-slate-200/70" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 rounded bg-slate-200/70" />
          <div className="h-4 w-20 rounded bg-slate-200/50" />
        </div>
        <div className="h-10 w-4/5 rounded-xl bg-slate-200/90" />
        <div className="h-5 w-full rounded bg-slate-200/60" />
        <div className="h-5 w-3/4 rounded bg-slate-200/60" />
      </div>

      {/* Hero Cover Image skeleton */}
      <div className="mb-10 aspect-16/9 md:aspect-21/9 w-full rounded-2xl md:rounded-3xl bg-slate-200/80" />

      {/* Content lines skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-slate-200/70" />
        <div className="h-4 w-11/12 rounded bg-slate-200/70" />
        <div className="h-4 w-full rounded bg-slate-200/70" />
        <div className="h-4 w-4/5 rounded bg-slate-200/70" />
        <div className="h-7 w-1/3 rounded-lg bg-slate-200/80 pt-4" />
        <div className="h-4 w-full rounded bg-slate-200/70" />
        <div className="h-4 w-5/6 rounded bg-slate-200/70" />
      </div>
    </div>
  );
}
