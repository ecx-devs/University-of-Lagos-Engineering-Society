import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

import { BLOG_POSTS } from '@/components/constants/blogs';
import { AboutAuthor } from '@/components/blog/AboutAuthor';
import { ContinueReading } from '@/components/blog/ContinueReading';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleJsonLd, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return pageMetadata({
    title: post.details.title,
    description: post.details.description,
    path: `/stories/blog/${slug}`,
    image: post.imageUrl,
    type: 'article',
    keywords: ['ULES blog', post.details.author, post.details.title],
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const { details, imageUrl, imageAlt, blogLink } = post;
  const { title, author, longDate, authorBio, authorPfp, body } = details;

  const paragraphs = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^https?:\/\/\S+$/.test(line));

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description: details.description,
          path: `/stories/blog/${slug}`,
          image: imageUrl,
          author,
        })}
      />

      <div className="px-section py-6 md:py-8 lg:py-11">
        <Link
          href="/stories/blog"
          className="text-primary hover:text-accent inline-flex items-center gap-2 text-base/6 font-medium transition-colors"
        >
          <ArrowLeft className="size-5 shrink-0" aria-hidden="true" />
          Go back
        </Link>
      </div>

      <article className="px-section pb-8 md:pb-10 lg:pb-16">
        <div className="text-accent flex flex-wrap items-center gap-x-4 gap-y-1 text-sm/5 md:text-base/6">
          <p className="flex items-center gap-x-2">
            <User className="size-4 shrink-0 md:size-4.5" aria-hidden="true" />
            <span>{author}</span>
          </p>
          <p className="flex items-center gap-x-2">
            <Calendar className="size-4 shrink-0 md:size-4.5" aria-hidden="true" />
            <span>{longDate}</span>
          </p>
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
          <ContinueReading href={blogLink}>
            {paragraphs.map((p, index) => (
              <p
                key={index}
                className="mt-4 text-lg/7 text-foreground first:mt-0 lg:text-xl/[32.5px]"
              >
                {p}
              </p>
            ))}
          </ContinueReading>
        </div>

        <AboutAuthor name={author} bio={authorBio} pfp={authorPfp} />
      </article>
    </>
  );
}
