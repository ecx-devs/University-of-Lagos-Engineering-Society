import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

type NewsListCardProps = {
  slug: string;
  details: {
    title: string;
    description: string;
    date: string;
  };
  imageUrl: string;
  imageAlt?: string | null;
  category?: string;
};

export function NewsListCard({
  slug,
  details,
  imageUrl,
  imageAlt,
  category = 'Digest',
}: NewsListCardProps) {
  const { title, description, date } = details;

  // Approximate reading time based on description length
  const readTime = '3 min read';

  return (
    <Link href={`/stories/news/${slug}`} className="group block h-full">
      <Card className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xs transition-all duration-300 hover:border-[#106333]/40 hover:shadow-lg hover:-translate-y-1">
        {/* Cover Image Container */}
        <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-slate-100">
          <Image
            src={imageUrl || '/news/default.png'}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Category Pill Overlay */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#170A51] backdrop-blur-md shadow-xs border border-white/40">
              {category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
          <div>
            {/* Meta Row: Date & Reading Time */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#106333]" aria-hidden="true" />
                <span>{date}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
                <span>{readTime}</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-3 line-clamp-2 text-xl font-semibold tracking-tight text-[#170A51] transition-colors duration-200 group-hover:text-[#106333] sm:text-2xl">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              {description}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex items-center gap-1.5 pt-4 border-t border-slate-100 text-sm font-semibold text-[#106333]">
            <span>Read full issue</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
