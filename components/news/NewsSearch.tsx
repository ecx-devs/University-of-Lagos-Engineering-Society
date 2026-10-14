'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function NewsSearch({ initialValue = '' }: { initialValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      const trimmed = searchTerm.trim();
      if (trimmed) {
        params.set('q', trimmed);
      } else {
        params.delete('q');
      }
      params.delete('page'); // Reset to page 1
      const query = params.toString();
      router.push(query ? `/stories/news?${query}` : '/stories/news');
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('q');
      params.delete('page');
      const query = params.toString();
      router.push(query ? `/stories/news?${query}` : '/stories/news');
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-72 md:w-80">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search digest & news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-10 pl-9 pr-9 text-sm rounded-lg border-border bg-white"
      />
      {isPending ? (
        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : searchTerm ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </form>
  );
}
