import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { getRecentNews } from '@/app/actions/news';

export async function NewsBanner() {
  const recent = await getRecentNews(1);
  const news = recent[0] || null;

  if (!news) return null;

  return (
    <div className="relative z-30 w-full overflow-hidden border-b border-white/10 bg-[#170A51] transition-colors hover:bg-[#1a0c5c]">
      <Link
        href={`/stories/news/${news.slug}`}
        className="group flex w-full items-center justify-between gap-3 px-4 py-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset sm:justify-center sm:gap-4 sm:py-2.5 max-w-7xl mx-auto"
      >

        {/* Title and Meta Information */}
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="truncate text-xs sm:text-sm font-medium text-white/95 group-hover:text-white transition-colors">
            {news.title}
          </span>

          {news.date && (
            <>
              <span aria-hidden="true" className="hidden md:inline text-white/30 text-xs">
                •
              </span>
              <span className="hidden md:inline text-xs text-white/70 shrink-0">
                {news.date}
              </span>
            </>
          )}
        </div>

        {/* Call to Action Arrow */}
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-200 shrink-0">
          <span className="hidden sm:inline">Read Story</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </Link>
    </div>
  );
}

export default NewsBanner;
