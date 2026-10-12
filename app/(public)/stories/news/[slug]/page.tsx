import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

import { NEWS_ITEMS } from '@/components/constants/news';
import { SITE_URL } from '@/components/constants/sites';
import { ShareNews } from '@/components/news/ShareNews';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleJsonLd, pageMetadata } from '@/lib/seo';

type Block = { kind: 'heading' | 'attribution' | 'paragraph'; text: string };

function toBlocks(body: string): Block[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text) => {
      if (text.length <= 60 && /[A-Z]/.test(text) && text === text.toUpperCase()) {
        return {
          kind: 'heading',
          text,
        };
      }
      if (text.startsWith('—')) {
        return {
          kind: 'attribution',
          text,
        };
      }
      return {
        kind: 'paragraph',
        text,
      };
    });
}

export function generateStaticParams() {
  return NEWS_ITEMS.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((newsItem) => newsItem.slug === slug);
  if (!item) return {};

  return pageMetadata({
    title: item.details.title,
    description: item.details.description,
    path: `/stories/news/${slug}`,
    image: item.imageUrl,
    type: 'article',
    keywords: ['ULES digest', 'ULES news', item.details.title],
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((newsItem) => newsItem.slug === slug);

  if (!item) {
    notFound();
  }

  const { details, imageUrl, imageAlt } = item;
  const { title, date, body } = details;
  const blocks = toBlocks(body);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description: details.description,
          path: `/stories/news/${slug}`,
          image: imageUrl,
        })}
      />

      <div className="px-section py-6 md:py-8 lg:py-11">
        <Link
          href="/stories/news"
          className="text-primary hover:text-accent inline-flex items-center gap-2 text-base/6 font-medium transition-colors"
        >
          <ArrowLeft className="size-5 shrink-0" aria-hidden="true" />
          Go back
        </Link>
      </div>

      <article className="px-section pb-8 md:pb-10 lg:pb-16">
        <div className="text-accent flex flex-wrap items-center gap-x-4 gap-y-1 text-sm/5 md:text-base/6">
          <Calendar className="size-4 shrink-0 md:size-4.5" aria-hidden="true" />
          <span>{date}</span>
        </div>

        <h1 className="text-primary mt-4 text-3xl/9 font-medium md:text-4xl/11 lg:text-5xl/12">
          {title}
        </h1>

        <div className="relative mt-6 aspect-1216/481 w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 78vw, 100vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="mt-8 max-w-287.75">
          {blocks.map((block, index) => {
            if (block.kind === 'heading') {
              return (
                <h2
                  key={index}
                  className="text-primary mt-8 mb-3 text-xl/7 font-medium first:mt-0 md:text-2xl/8"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.kind === 'attribution') {
              return (
                <p key={index} className="mt-2 text-base/6 text-muted-foreground italic">
                  {block.text}
                </p>
              );
            }
            return (
              <p
                key={index}
                className="mt-4 text-lg/7 text-foreground first:mt-0 lg:text-xl/[32.5px]"
              >
                {block.text}
              </p>
            );
          })}
        </div>

        <ShareNews title={title} url={`${SITE_URL}/stories/news/${slug}`} />
      </article>
    </>
  );
}
