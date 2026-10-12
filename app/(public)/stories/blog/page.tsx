import { PageBanner } from '@/components/section/PageBanner';
import { BlogList } from '@/components/blog/BlogList';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'ULES Blog',
  description:
    "Insights, tips and stories from the ULES community — on tech, careers, campus life and opinion.",
  path: '/stories/blog',
  keywords: ['ULES blog', 'UNILAG engineering blog', 'engineering student tips'],
});

export default function Blog() {
  return (
    <>
      <PageBanner title="ULES Blog" tagline="Insights, tips, and stories from the ULES community" />
      <Reveal>
        <BlogList />
      </Reveal>
    </>
  );
}
