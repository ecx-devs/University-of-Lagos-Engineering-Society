'use client';

import { motion } from 'motion/react';
import { BlogCard } from '@/components/blog/BlogCard';
import { FeaturedBlogCard } from '@/components/blog/FeaturedBlogCard';
import { EmptyState } from '@/components/ui/empty-state';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { BlogFilterPills } from '@/components/blog/BlogFilterPills';
import type { BlogPostData } from '@/app/actions/blogs';

type BlogListProps = {
  items: BlogPostData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search?: string;
  category?: string;
};

export function BlogList({
  items,
  total,
  page,
  pageSize,
  totalPages,
  search = '',
  category = 'All',
}: BlogListProps) {
  const isSearching = Boolean(search?.trim());
  const isFilteringCategory = Boolean(category && category.toLowerCase() !== 'all');

  // Display featured hero card on page 1 only when not actively searching/filtering
  const showFeaturedHero = page === 1 && !isSearching && !isFilteringCategory && items.length > 0;
  const featuredItem = showFeaturedHero ? items[0] : null;
  const gridItems = showFeaturedHero ? items.slice(1) : items;

  return (
    <section className="px-section py-8 md:py-12 lg:py-16 max-w-7xl mx-auto">
      {/* Category Pills & Search Controls Bar */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/70 pb-6">
        <div className="min-w-0 flex-1">
          <BlogFilterPills activeCategory={category} searchQuery={search} />
        </div>
        <div className="shrink-0">
          <BlogSearch initialValue={search} />
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div
        key={`blog-list-${page}-${category}-${search}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {items.length === 0 ? (
          <div className="py-16 text-center">
            {isSearching || isFilteringCategory ? (
              <div className="max-w-md mx-auto space-y-4">
                <EmptyState
                  title="No stories found"
                  description={
                    isSearching
                      ? `We couldn't find any articles matching "${search}". Try another keyword or reset filters.`
                      : `No stories are filed under "${category}" yet. Select another category or pick All to see everything.`
                  }
                />
                <div className="pt-2">
                  <a
                    href="/stories/blog"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#170A51] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#170A51]/90 transition-colors"
                  >
                    Clear filters & search
                  </a>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No blog stories published yet"
                description="There are no stories published right now. Check back soon, or follow our announcements."
              />
            )}
          </div>
        ) : (
          <>
            {featuredItem && (
              <FeaturedBlogCard
                slug={featuredItem.slug}
                category={featuredItem.category}
                release={featuredItem.release}
                title={featuredItem.title}
                description={featuredItem.description}
                author={featuredItem.author}
                authorPfp={featuredItem.authorPfp}
                date={featuredItem.date}
                readTime={featuredItem.readTime}
                imageUrl={featuredItem.imageUrl}
                imageAlt={featuredItem.imageAlt || featuredItem.title}
              />
            )}

            {/* Grid of Articles */}
            {gridItems.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridItems.map((post) => (
                  <BlogCard
                    key={post.id}
                    slug={post.slug}
                    category={post.category}
                    details={{
                      release: post.release,
                      title: post.title,
                      author: post.author,
                      authorPfp: post.authorPfp,
                      date: post.date,
                      readTime: post.readTime,
                      description: post.description,
                    }}
                    imageUrl={post.imageUrl}
                    imageAlt={post.imageAlt || post.title}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <BlogPagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </motion.div>
    </section>
  );
}
