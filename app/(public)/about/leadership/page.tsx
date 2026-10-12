import { Excos } from '@/components/about-us/leadership';
import { PageBanner } from '@/components/section/PageBanner';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'Executive Council',
  description:
    "Meet the ULES Executive Council for the 2025/2026 session — the students representing the Faculty of Engineering at UNILAG.",
  path: '/about/leadership',
  keywords: ['ULES EXCO', 'ULES executives', 'ULES leadership 2026'],
});

export default function AboutLeadership() {
  return (
    <>
      <PageBanner title="Executive Council" tagline="Meet the members of the Force 25/26" />
      <Reveal>
        <Excos />
      </Reveal>
    </>
  );
}
