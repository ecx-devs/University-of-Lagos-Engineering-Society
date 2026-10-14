'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { label: 'All Issues', value: 'All' },
  { label: 'Bi-weekly Digest', value: 'Digest' },
  { label: 'Academic Updates', value: 'Academic' },
  { label: 'Campus Life & Events', value: 'Campus Life' },
  { label: 'Innovation & Wins', value: 'Innovation' },
  { label: 'Announcements', value: 'Announcements' },
];

export function NewsFilterPills({
  activeCategory = 'All',
  searchQuery = '',
}: {
  activeCategory?: string;
  searchQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleSelect = (categoryValue: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (categoryValue === 'All') {
        params.delete('category');
      } else {
        params.set('category', categoryValue);
      }
      params.delete('page'); // Reset to page 1 on filter change
      const query = params.toString();
      router.push(query ? `/stories/news?${query}` : '/stories/news');
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected =
          (cat.value === 'All' && (!activeCategory || activeCategory === 'All')) ||
          activeCategory === cat.value;

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleSelect(cat.value)}
            className={cn(
              'inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-2xs',
              isSelected
                ? 'bg-[#170A51] text-white shadow-xs scale-102 font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
