import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Bookmark } from 'lucide-react';
import type { Metadata } from 'next';

import { SITE_URL } from '@/components/constants/sites';
import { ShareNews } from '@/components/news/ShareNews';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleJsonLd, pageMetadata } from '@/lib/seo';
import { getNewsBySlug, getAllNewsSlugs } from '@/app/actions/news';
import { parseNewsBody } from '@/lib/news-parser';

export const revalidate = 60; // Revalidate dynamic content every 60 seconds

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item || !item.isPublished) return {};

  return pageMetadata({
    title: item.title,
    description: item.description,
    path: `/stories/news/${slug}`,
    image: item.imageUrl,
    type: 'article',
    keywords: ['ULES digest', 'ULES news', item.title, item.category],
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item || !item.isPublished) {
    notFound();
  }

  const { title, date, body, imageUrl, imageAlt, description, category } = item;
  const blocks = parseNewsBody(body);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description,
          path: `/stories/news/${slug}`,
          image: imageUrl,
        })}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16 md:pt-10 md:pb-24">
        {/* Top Breadcrumb & Back Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href="/stories/news"
            className="inline-flex items-center gap-2 font-semibold text-[#170A51] hover:text-[#106333] transition-colors"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
            <span>Back to ULES News</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#106333] border border-emerald-200">
              <Bookmark className="size-3" />
              {category || 'Digest'}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-slate-500 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 text-[#106333]" aria-hidden="true" />
              <span>{date}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-slate-400" aria-hidden="true" />
              <span>3 min read</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold tracking-tight text-[#170A51] sm:text-4xl lg:text-5xl leading-tight">
            {title}
          </h1>

          {/* Lead Summary */}
          {description && (
            <p className="mt-4 text-lg sm:text-xl font-normal leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </header>

        {/* Hero Cover Image */}
        <div className="relative mb-10 aspect-16/9 md:aspect-21/9 w-full overflow-hidden rounded-2xl md:rounded-3xl bg-slate-100 shadow-sm border border-slate-200/80">
          <Image
            src={imageUrl || '/news/default.png'}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose prose-slate max-w-none">
          <div className="space-y-5">
            {blocks.map((block, index) => {
              if (block.kind === 'heading') {
                if (block.level === 3) {
                  return (
                    <h3
                      key={index}
                      className="text-[#170A51] mt-8 mb-2 text-xl font-bold tracking-tight"
                    >
                      {block.text}
                    </h3>
                  );
                }
                return (
                  <h2
                    key={index}
                    className="text-[#170A51] mt-10 mb-3 text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-100 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-6 bg-[#106333] rounded-full inline-block" />
                    <span>{block.text}</span>
                  </h2>
                );
              }

              if (block.kind === 'attribution') {
                return (
                  <div
                    key={index}
                    className="my-3 rounded-xl bg-slate-50/80 border-l-3 border-[#106333] p-3 text-sm sm:text-base text-slate-600 italic font-medium"
                  >
                    {block.text}
                  </div>
                );
              }

              if (block.kind === 'quote') {
                return (
                  <blockquote
                    key={index}
                    className="my-7 rounded-2xl border-l-4 border-[#C85B15] bg-[#C85B15]/5 px-6 py-5 italic text-slate-800 text-lg sm:text-xl leading-relaxed font-serif"
                  >
                    {block.text}
                  </blockquote>
                );
              }

              if (block.kind === 'list') {
                return (
                  <ul
                    key={index}
                    className="my-4 list-disc space-y-2 pl-6 text-slate-700 text-base sm:text-lg leading-relaxed"
                  >
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p
                  key={index}
                  className="text-base sm:text-lg text-slate-800 leading-relaxed font-sans"
                >
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Social Share Section */}
          <ShareNews title={title} url={`${SITE_URL}/stories/news/${slug}`} />
        </article>
      </div>
    </>
  );
}
