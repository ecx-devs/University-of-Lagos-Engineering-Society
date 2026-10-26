'use client';

import { useState, useMemo } from 'react';
import { ExcoCard } from './excoCard';
import type { ExecutiveLeaderData } from '@/app/actions/leadership';
import { Search, Users, Mail, X } from 'lucide-react';
import Link from 'next/link';

export interface ExcosProps {
  leaders?: ExecutiveLeaderData[];
}

/**
 * Loading skeleton matching the ExcoCard layout
 */
export function ExcosSkeleton() {
  return (
    <section className="xs:px-[4.2%] px-4 py-12 lg:px-[4.5%] xl:px-[7.75%]">
      <div className="mx-auto mb-10 max-w-md">
        <div className="h-11 w-full rounded-full bg-slate-200/80 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-full max-w-75 rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="aspect-4/5 h-56 w-full bg-slate-200/80" />
            {/* Content Placeholders */}
            <div className="p-4.5 space-y-3">
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-200/70" />
              <div className="h-3 w-4/5 rounded bg-slate-200/60" />
              <div className="pt-3 border-t border-border/40 space-y-2">
                <div className="h-3 w-2/3 rounded bg-slate-200/50" />
                <div className="h-3 w-3/4 rounded bg-slate-200/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Empty state when no leaders are found or published
 */
export function ExcosEmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery?: string;
  onClear?: () => void;
}) {
  return (
    <div className="my-10 mx-auto max-w-xl text-center px-6 py-14 rounded-2xl border border-dashed border-border bg-slate-50/70 shadow-2xs">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Users className="size-7" />
      </div>
      <h3 className="font-['Neue_Machina'] text-xl font-bold text-foreground">
        {searchQuery ? 'No Leaders Found' : 'Leadership Directory Updating'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {searchQuery
          ? `No executive members match "${searchQuery}". Try searching by another name, office (e.g. "President", "Social Secretary"), or department.`
          : 'The executive council profiles for this academic tenure are currently being finalized. Please check back shortly.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {searchQuery ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        ) : (
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-colors"
          >
            <Mail className="size-3.5" />
            Contact ULES Secretariat
          </Link>
        )}
      </div>
    </div>
  );
}

export function Excos({ leaders = [] }: ExcosProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered leaders based on instant search query
  const filteredLeaders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return leaders;

    return leaders.filter((exco) => {
      return (
        exco.name.toLowerCase().includes(q) ||
        exco.title.toLowerCase().includes(q) ||
        exco.department.toLowerCase().includes(q) ||
        exco.email.toLowerCase().includes(q) ||
        exco.phoneNumber.includes(q)
      );
    });
  }, [leaders, searchQuery]);

  if (!leaders || leaders.length === 0) {
    return (
      <section className="xs:px-[4.2%] px-4 py-16 lg:px-[4.5%] xl:px-[7.75%]">
        <ExcosEmptyState />
      </section>
    );
  }

  return (
    <section className="xs:px-[4.2%] px-4 py-10 md:py-16 lg:px-[4.5%] xl:px-[7.75%]">
      {/* Search Bar Controls */}
      <div className="mx-auto mb-10 max-w-2xl text-center space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, office (e.g. Social Secretary, President), or department..."
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-10 text-sm text-foreground shadow-xs placeholder:text-muted-foreground/70 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
            aria-label="Search executive council members"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredLeaders.length}</span> of{' '}
          <span className="font-semibold text-foreground">{leaders.length}</span> executive council members
        </p>
      </div>

      {filteredLeaders.length === 0 ? (
        <ExcosEmptyState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
      ) : (
        <div className="flex flex-wrap justify-center gap-6 md:gap-7 2xl:gap-8">
          {filteredLeaders.map((exco) => (
            <div
              key={exco.id}
              className="w-full max-w-72 sm:w-[calc(50%-1.25rem)] sm:max-w-72 lg:w-[calc(33.333%-1.5rem)] lg:max-w-72 xl:w-[calc(25%-1.5rem)] 2xl:w-[calc(20%-1.75rem)] flex flex-col transition-all duration-300"
            >
              <ExcoCard
                name={exco.name}
                title={exco.title}
                department={exco.department}
                phoneNumber={exco.phoneNumber}
                email={exco.email}
                imageUrl={exco.imageUrl}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


