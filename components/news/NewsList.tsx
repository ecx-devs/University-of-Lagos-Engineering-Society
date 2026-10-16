'use client';

import { motion } from 'motion/react';
import { Newspaper, SearchX, RotateCcw } from 'lucide-react';
import { NewsListCard } from '@/components/news/NewsListCard';
import { FeaturedNewsCard } from '@/components/news/FeaturedNewsCard';
import { EmptyState } from '@/components/ui/empty-state';
import { NewsPagination } from '@/components/news/NewsPagination';
import { NewsSearch } from '@/components/news/NewsSearch';
import { NewsFilterPills } from '@/components/news/NewsFilterPills';
import type { NewsItemData } from '@/app/actions/news';

type NewsListProps = {
  items: NewsItemData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search?: string;
  category?: string;
};

export function NewsList({
  items,
  total,
  page,
  pageSize,
  totalPages,
  search = '',
  category = 'All',
}: NewsListProps) {
  const isSearching = Boolean(search?.trim());
  const isFilteringCategory = Boolean(category && category !== 'All');

  // Display featured hero card on page 1 only when not actively searching/filtering
  const showFeaturedHero = page === 1 && !isSearching && !isFilteringCategory && items.length > 0;
  const featuredItem = showFeaturedHero ? items[0] : null;
  const gridItems = showFeaturedHero ? items.slice(1) : items;

  return (
    <section className="px-section py-8 md:py-12 lg:py-16 max-w-7xl mx-auto">
      {/* Category Pills & Search Controls Bar */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/70 pb-6">
        <div className="min-w-0 flex-1">
          <NewsFilterPills activeCategory={category} searchQuery={search} />
        </div>
        <div className="shrink-0">
          <NewsSearch initialValue={search} />
        </div>
      </div>

      {/* Main Content Area - Keyed for seamless pagination animation without getting stuck */}
      <motion.div
        key={`news-list-${page}-${category}-${search}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {items.length === 0 ? (
          <div className="py-8">
            {isSearching || isFilteringCategory ? (
              <EmptyState
                icon={SearchX}
                badge="Search & Filter"
                title="No articles found"
                description={
                  isSearching
                    ? `We couldn't find any news issues matching "${search}". Try searching with different keywords or clearing filters.`
                    : `No news articles are filed under "${category}" yet. Select another category or view all.`
                }
                action={{
                  label: 'Clear filters & search',
                  href: '/stories/news',
                  icon: RotateCcw,
                }}
              />
            ) : (
              <EmptyState
                icon={Newspaper}
                badge="Editorial Desk"
                title="No news published yet"
                description="There are no announcements published right now. Check back soon for fresh updates directly from the faculty executive."
              />
            )}
          </div>
        ) : (
          <>
            {/* Featured Article on page 1 */}
            {featuredItem && (
              <FeaturedNewsCard
                slug={featuredItem.slug}
                details={{
                  title: featuredItem.title,
                  description: featuredItem.description,
                  date: featuredItem.date,
                }}
                imageUrl={featuredItem.imageUrl}
                imageAlt={featuredItem.imageAlt || featuredItem.title}
                category={featuredItem.category || 'Digest'}
              />
            )}

            {/* Grid of Issues */}
            {gridItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {gridItems.map((item) => (
                  <NewsListCard
                    key={item.id}
                    slug={item.slug}
                    details={{
                      title: item.title,
                      description: item.description,
                      date: item.date,
                    }}
                    imageUrl={item.imageUrl}
                    imageAlt={item.imageAlt || item.title}
                    category={item.category || 'Digest'}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <NewsPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              search={search}
              category={category}
              baseUrl="/stories/news"
            />
          </>
        )}
      </motion.div>
    </section>
  );
}
