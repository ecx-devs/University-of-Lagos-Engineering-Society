import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Tag, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

import { SITE_URL } from '@/components/constants/sites';
import { AboutAuthor } from '@/components/blog/AboutAuthor';
import { ShareBlog } from '@/components/blog/ShareBlog';
import { BlogCard } from '@/components/blog/BlogCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleJsonLd, pageMetadata } from '@/lib/seo';
import { getBlogPostBySlug, getAllBlogSlugs, getRecentBlogPosts } from '@/app/actions/blogs';
import { parseBlogBody } from '@/lib/blog-parser';
import { OptimizedImage } from '@/components/ui/optimized-image';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.isPublished) return {};

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/stories/blog/${slug}`,
    image: post.imageUrl,
    type: 'article',
    keywords: ['ULES blog', post.author, post.title, post.category],
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  const {
    title,
    author,
    authorBio,
    authorPfp,
    date,
    readTime,
    body,
    imageUrl,
    imageAlt,
    description,
    category,
    release,
  } = post;

  const blocks = parseBlogBody(body);
  const recentPosts = (await getRecentBlogPosts(3)).filter((p) => p.slug !== slug);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description,
          path: `/stories/blog/${slug}`,
          image: imageUrl,
          author,
        })}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16 md:pt-10 md:pb-24">
        {/* Top Breadcrumb & Category Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href="/stories/blog"
            className="inline-flex items-center gap-2 font-semibold text-[#170A51] hover:text-[#C85B15] transition-colors"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
            <span>Back to ULES Blog</span>
          </Link>

          <div className="flex items-center gap-2">
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#170A51] border border-slate-200">
                <Tag className="size-3 text-[#C85B15]" />
                {category}
              </span>
            )}
            {release && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#170A51]/10 text-[#170A51]">
                {release}
              </span>
            )}
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-slate-500 mb-4">
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              {authorPfp ? (
                <div className="relative size-4.5 overflow-hidden rounded-full border border-slate-200 bg-white">
                  <Image src={authorPfp} alt={author} fill sizes="18px" className="object-contain" />
                </div>
              ) : (
                <User className="size-4 text-[#C85B15]" aria-hidden="true" />
              )}
              <span className="font-semibold">{author}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 text-slate-400" aria-hidden="true" />
              <span>{date}</span>
            </span>
            {readTime && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-slate-400" aria-hidden="true" />
                  <span>{readTime}</span>
                </span>
              </>
            )}
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
          <OptimizedImage
            src={imageUrl || '/blogs/my-first-love-letter.jpeg'}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose prose-slate max-w-none">
          <div className="space-y-6">
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
                    className="text-[#170A51] mt-10 mb-3 text-2xl sm:text-3xl font-bold tracking-tight pb-2 border-b border-slate-100 flex items-center gap-2.5"
                  >
                    <span className="w-1.5 h-6 bg-[#C85B15] rounded-full inline-block shrink-0" />
                    <span>{block.text}</span>
                  </h2>
                );
              }

              if (block.kind === 'attribution') {
                return (
                  <div
                    key={index}
                    className="my-4 rounded-xl bg-slate-50/90 border-l-3 border-[#C85B15] p-3.5 text-sm sm:text-base text-slate-700 italic font-medium"
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
                    &ldquo;{block.text}&rdquo;
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
          <ShareBlog title={title} url={`${SITE_URL}/stories/blog/${slug}`} />

          {/* About Author Section */}
          <AboutAuthor name={author} bio={authorBio} pfp={authorPfp} />
        </article>

        {/* Related Stories Section */}
        {recentPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C85B15]">
                  More from ULES
                </span>
                <h3 className="text-2xl font-bold text-[#170A51] mt-0.5">Recommended Stories</h3>
              </div>
              <Link
                href="/stories/blog"
                className="text-sm font-semibold text-[#170A51] hover:text-[#C85B15] transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentPosts.slice(0, 2).map((p) => (
                <BlogCard
                  key={p.id}
                  slug={p.slug}
                  category={p.category}
                  details={{
                    release: p.release,
                    title: p.title,
                    author: p.author,
                    authorPfp: p.authorPfp,
                    date: p.date,
                    readTime: p.readTime,
                    description: p.description,
                  }}
                  imageUrl={p.imageUrl}
                  imageAlt={p.imageAlt || p.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
