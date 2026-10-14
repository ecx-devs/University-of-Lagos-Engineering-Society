import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, User, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';

export type BlogCardProps = {
  slug: string;
  category?: string;
  details: {
    release?: string;
    title: string;
    author: string;
    authorPfp?: string | null;
    date: string;
    readTime?: string;
    description: string;
  };
  imageUrl: string;
  imageAlt?: string;
};

export function BlogCard({ slug, category, details, imageUrl, imageAlt }: BlogCardProps) {
  const { release, title, author, authorPfp, date, readTime, description } = details;

  return (
    <Link href={`/stories/blog/${slug}`} className="group block h-full">
      <Card className="hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-xs transition-all duration-300 hover:border-[#C85B15]/40 hover:shadow-md ring-0">
        {/* Cover Image Container */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl || '/blogs/my-first-love-letter.jpeg'}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Release and Category Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-[#170A51] shadow-2xs">
                <Tag className="size-3 text-[#C85B15]" />
                {category}
              </span>
            )}
            {release && (
              <span className="inline-flex rounded-full bg-[#170A51]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs">
                {release}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            {/* Meta Row: Author & Date */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                {authorPfp ? (
                  <div className="relative size-4.5 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                    <Image src={authorPfp} alt={author} fill sizes="18px" className="object-contain" />
                  </div>
                ) : (
                  <User className="size-3.5 text-slate-400 shrink-0" />
                )}
                <span className="truncate font-medium text-slate-700">{author}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span>{date}</span>
                {readTime && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-slate-400" />
                      {readTime}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#170A51] transition-colors duration-200 group-hover:text-[#C85B15]">
              {title}
            </h3>

            {/* Teaser Description */}
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          </div>

          {/* Read Article Footer Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#170A51] group-hover:text-[#C85B15] transition-colors">
            <span>Read full story</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default BlogCard;
