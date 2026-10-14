import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles, User, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';

type FeaturedBlogCardProps = {
  slug: string;
  category?: string;
  release?: string;
  title: string;
  description: string;
  author: string;
  authorPfp?: string | null;
  date: string;
  readTime?: string;
  imageUrl: string;
  imageAlt?: string;
};

export function FeaturedBlogCard({
  slug,
  category = 'Campus Life',
  release = 'Release #01',
  title,
  description,
  author,
  authorPfp,
  date,
  readTime = '4 min read',
  imageUrl,
  imageAlt,
}: FeaturedBlogCardProps) {
  return (
    <Link href={`/stories/blog/${slug}`} className="group mb-12 block">
      <Card className="hover-lift overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-0 shadow-sm transition-all duration-300 hover:border-[#C85B15]/40 hover:shadow-lg ring-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] lg:col-span-7 overflow-hidden bg-slate-100">
            <Image
              src={imageUrl || '/blogs/my-first-love-letter.jpeg'}
              alt={imageAlt || title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#170A51]/95 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
              Featured
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#170A51] shadow-sm">
                <Tag className="size-3 text-[#C85B15]" />
                {category}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 bg-white">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="inline-block uppercase tracking-wider font-semibold text-[#C85B15]">
                  {release}
                </span>
                <span className="text-slate-300">•</span>
                <span>{date}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-slate-400" />
                  {readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold leading-tight text-[#170A51] transition-colors duration-200 group-hover:text-[#C85B15]">
                {title}
              </h2>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 line-clamp-4">
                {description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {authorPfp ? (
                  <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white p-0.5">
                    <Image src={authorPfp} alt={author} fill sizes="32px" className="object-contain" />
                  </div>
                ) : (
                  <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="size-4" />
                  </div>
                )}
                <div>
                  <span className="block text-xs font-bold text-slate-800">{author}</span>
                  <span className="block text-[11px] text-slate-400">Author</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#170A51] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#C85B15]">
                <span>Read Story</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
