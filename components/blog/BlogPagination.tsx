'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getPaginationRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total];
  }
  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export function BlogPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const navigateToPage = (targetPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (targetPage <= 1) {
        params.delete('page');
      } else {
        params.set('page', targetPage.toString());
      }
      const query = params.toString();
      router.push(query ? `/stories/blog?${query}` : '/stories/blog');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 pt-8"
    >
      <div className="text-xs text-slate-500 font-medium order-2 sm:order-1">
        Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => navigateToPage(currentPage - 1)}
          aria-label="Go to previous page"
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer h-9 px-3 text-xs"
        >
          <ChevronLeft className="mr-1 size-4" /> Previous
        </Button>

        {/* Numbered Page Buttons for tablet/desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex size-9 items-center justify-center text-slate-400"
                >
                  <MoreHorizontal className="size-4" />
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => navigateToPage(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`size-9 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#170A51] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => navigateToPage(currentPage + 1)}
          aria-label="Go to next page"
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer h-9 px-3 text-xs"
        >
          Next <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </nav>
  );
}
