import Blog from '@/components/home/blog';
import Events from '@/components/home/events';
import Hero from '@/components/home/hero';
import News from '@/components/home/news';
import Welcome from '@/components/home/welcome';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

// The root page shares a segment with the root layout, so `title.template`
// doesn't apply to it — whatever is set here becomes the whole <title>. That
// makes "Home" a wasted tag; lead with the brand and the primary keyword.
export const metadata = pageMetadata({
  title: 'University of Lagos Engineering Society',
  description:
    "The official home of the University of Lagos Engineering Society — 6,000+ students, 10 departments, and 60+ years of engineering excellence at UNILAG.",
  path: '/',
  keywords: ['ULES home', 'UNILAG engineering society', 'engineering faculty Lagos'],
});

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <Welcome />
      </Reveal>
      <Reveal>
        <Events />
      </Reveal>
      <Reveal>
        <News />
      </Reveal>
      <Reveal>
        <Blog />
      </Reveal>
    </>
  );
}
