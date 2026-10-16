import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Sparkles } from 'lucide-react';

type FeaturedNewsCardProps = {
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

export function FeaturedNewsCard({
  slug,
  details,
  imageUrl,
  imageAlt,
  category = 'Digest',
}: FeaturedNewsCardProps) {
  const { title, description, date } = details;

  return (
    <Link href={`/stories/news/${slug}`} className="group block mb-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-0 shadow-sm transition-all duration-300 hover:border-[#106333]/50 hover:shadow-xl lg:grid lg:grid-cols-12 lg:gap-0">
        {/* Cover Image Container (7 cols) */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 lg:col-span-7 lg:aspect-auto lg:min-h-[380px]">
          <Image
            src={imageUrl || '/news/default.png'}
            alt={imageAlt || title}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
          />
          {/* Subtle gradient overlay on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          
          {/* Featured pill badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#106333] text-white shadow-md">
              Featured
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#170A51] backdrop-blur-md shadow-xs border border-white/50">
              {category}
            </span>
          </div>
        </div>

        {/* Content Body (5 cols) */}
        <div className="flex flex-col justify-between p-7 sm:p-9 lg:col-span-5 lg:p-10">
          <div>
            {/* Meta Row: Date & Reading Time */}
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#106333]" aria-hidden="true" />
                <span>{date}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
                <span>4 min read</span>
              </span>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#170A51] transition-colors duration-200 group-hover:text-[#106333] sm:text-3xl lg:text-3xl/tight">
              {title}
            </h2>

            {/* Excerpt */}
            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-600 line-clamp-3 lg:line-clamp-4">
              {description}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex items-center gap-2 font-semibold text-[#106333] pt-4 border-t border-slate-100">
            <span>Read full story</span>
            <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </Link>
  );
}
