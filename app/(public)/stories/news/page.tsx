import { PageBanner } from '@/components/section/PageBanner';
import { NewsList } from '@/components/news/NewsList';
import { pageMetadata } from '@/lib/seo';
import { getPaginatedNews } from '@/app/actions/news';

export const metadata = pageMetadata({
  title: 'ULES News',
  description:
    "The ULES Bi-weekly Digest — updates, announcements and achievements from the Faculty of Engineering at UNILAG.",
  path: '/stories/news',
  keywords: ['ULES news', 'ULES digest', 'UNILAG engineering news'],
});

export const revalidate = 60; // ISR cache revalidation every minute

export default async function News({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; q?: string; category?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10) || 1);
  const search = resolvedParams.q || '';
  const category = resolvedParams.category || 'All';

  const { items, total, pageSize, totalPages } = await getPaginatedNews({
    page,
    pageSize: 6,
    publishedOnly: true,
    search,
    category,
  });

  return (
    <>
      <PageBanner
        title="ULES News"
        tagline="Stay informed about the latest ULES updates, achievements, and bi-weekly digests"
      />
      <NewsList
        items={items}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        search={search}
        category={category}
      />
    </>
  );
}
