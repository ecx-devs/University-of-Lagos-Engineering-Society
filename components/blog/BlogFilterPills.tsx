'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BLOG_CATEGORIES } from '@/components/constants/blogs';

const CATEGORIES = [
  { label: 'All Stories', value: 'All' },
  ...BLOG_CATEGORIES.map((cat) => ({ label: cat, value: cat })),
];

export function BlogFilterPills({
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
      params.delete('page'); // Reset to page 1 on category change
      const query = params.toString();
      router.push(query ? `/stories/blog?${query}` : '/stories/blog');
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected =
          (cat.value === 'All' && (!activeCategory || activeCategory.toLowerCase() === 'all')) ||
          activeCategory.toLowerCase() === cat.value.toLowerCase();

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleSelect(cat.value)}
            className={cn(
              'inline-flex shrink-0 items-center rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-2xs',
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
