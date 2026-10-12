import { PageBanner } from '@/components/section/PageBanner';
import { NewsList } from '@/components/news/NewsList';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'News & Announcements',
  description:
    "The ULES Bi-weekly Digest — updates, announcements and achievements from the Faculty of Engineering at UNILAG.",
  path: '/stories/news',
  keywords: ['ULES news', 'ULES digest', 'UNILAG engineering news'],
});

export default function News() {
  return (
    <>
      <PageBanner
        title="News & Announcements"
        tagline="Stay informed about the latest ULES updates and achievements"
      />
      <Reveal>
        <NewsList />
      </Reveal>
    </>
  );
}
