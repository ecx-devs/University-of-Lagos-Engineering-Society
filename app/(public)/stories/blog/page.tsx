import { PageBanner } from '@/components/section/PageBanner';
import { BlogList } from '@/components/blog/BlogList';
import { pageMetadata } from '@/lib/seo';
import { getPaginatedBlogPosts } from '@/app/actions/blogs';

export const metadata = pageMetadata({
  title: 'ULES Blog',
  description:
    'Insights, tips, tech innovations, and stories from the University of Lagos Engineering Society community.',
  path: '/stories/blog',
  keywords: ['ULES blog', 'UNILAG engineering blog', 'engineering student tips', 'student stories'],
});

export const revalidate = 60; // ISR cache revalidation every minute

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; q?: string; category?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10) || 1);
  const search = resolvedParams.q || '';
  const category = resolvedParams.category || 'All';

  const { items, total, pageSize, totalPages } = await getPaginatedBlogPosts({
    page,
    pageSize: 6,
    publishedOnly: true,
    search,
    category,
  });

  return (
    <>
      <PageBanner
        title="ULES Blog"
        tagline="Insights, tech breakthroughs, career wisdom, and stories from the ULES community"
      />
      <BlogList
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
