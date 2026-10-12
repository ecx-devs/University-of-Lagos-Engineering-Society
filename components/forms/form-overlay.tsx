
export function FormOverlay({
  active,
  label = 'Coming soon',
  title,
  description,
  variant = 'card',
  children,
}: {
  
  active: boolean;
  label?: string;
  title: string;
  description?: string;
  
  variant?: 'card' | 'compact';
  children: React.ReactNode;
}) {
  if (!active) return <>{children}</>;

  const badge = (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs/4 font-medium tracking-wide text-destructive uppercase">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
      {label}
    </span>
  );

  return (
    <div className="relative">
      <div inert aria-hidden="true" className="pointer-events-none select-none">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60 p-3 backdrop-blur-[2px]">
        {variant === 'compact' ? (
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            {badge}
            <span className="text-sm/5 font-medium text-foreground">{title}</span>
          </p>
        ) : (
          <div className="bg-primary max-w-sm rounded-lg border border-border px-6 py-5 text-center shadow-sm">
            {badge}
            <p className="text-accent mt-3 text-base/6 font-medium">{title}</p>
            {description && <p className="mt-2 text-sm/5 text-[hsl(218,14%,84%)]">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
