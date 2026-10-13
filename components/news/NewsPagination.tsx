'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NewsPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  search?: string;
  category?: string;
  baseUrl?: string;
};

export function NewsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  search = '',
  category = 'All',
  baseUrl = '/stories/news',
}: NewsPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    }
    if (search.trim()) {
      params.set('q', search.trim());
    }
    if (category && category !== 'All') {
      params.set('category', category);
    }
    const query = params.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  };

  // Generate visible page numbers
  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label="News navigation"
      className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
        <span className="font-medium text-foreground">{endItem}</span> of{' '}
        <span className="font-medium text-foreground">{totalItems}</span> issues
      </p>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link href={getPageUrl(currentPage - 1)}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-border text-foreground hover:bg-muted"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden xs:inline">Previous</span>
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="gap-1 border-border text-muted-foreground opacity-50"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden xs:inline">Previous</span>
          </Button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-sm text-muted-foreground select-none"
                >
                  …
                </span>
              );
            }

            const isCurrent = item === currentPage;
            return isCurrent ? (
              <span
                key={item}
                aria-current="page"
                className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
              >
                {item}
              </span>
            ) : (
              <Link key={item} href={getPageUrl(item)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-9 p-0 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {item}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link href={getPageUrl(currentPage + 1)}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-border text-foreground hover:bg-muted"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="gap-1 border-border text-muted-foreground opacity-50"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}
