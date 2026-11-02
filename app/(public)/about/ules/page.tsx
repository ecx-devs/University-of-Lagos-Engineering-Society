import { PageBanner } from '@/components/section/PageBanner';
import { WhoWeAre } from '@/components/about-us/WhoWeAre';
import {
  AboutVideo,
  EXPERIENCE_VIDEO_PLAYBACK_ID,
  VIDEO_THUMBNAIL_TIME,
} from '@/components/about-us/AboutVideo';
import { OurMissionAndVision } from '@/components/about-us/MissionAndVision';
import { OurCoreValues } from '@/components/about-us/CoreValues';
import { FAQs } from '@/components/about-us/faqs';
import { pageMetadata, videoObjectJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/motion/Reveal';

const VIDEO_THUMBNAIL = `https://image.mux.com/${EXPERIENCE_VIDEO_PLAYBACK_ID}/thumbnail.jpg?time=${VIDEO_THUMBNAIL_TIME}&width=1200&height=630&fit_mode=smartcrop`;

export const metadata = pageMetadata({
  title: 'About ULES',
  description:
    'Discover ULES: our legacy, mission, core values, and the vibrant student life across 6,000 engineering students in 10 departments at UNILAG.',
  path: '/about/ules',
  image: VIDEO_THUMBNAIL,
  keywords: [
    'about ULES',
    'Experience ULES',
    'ULES video',
    'UNILAG engineering student life',
    'Faculty of Engineering UNILAG video',
    'University of Lagos Engineering Society',
    'ULES mission',
    'ULES core values',
    'ULES FAQs',
  ],
});

export default function AboutULES() {
  const videoSchema = videoObjectJsonLd({
    name: 'Experience ULES — Faculty of Engineering, University of Lagos',
    description:
      'Experience the vibrant spirit of our engineering community — energy, innovation, and fellowship across 10 engineering departments at UNILAG.',
    thumbnailUrl: VIDEO_THUMBNAIL,
    uploadDate: '2026-01-01T08:00:00Z',
    contentUrl: `https://stream.mux.com/${EXPERIENCE_VIDEO_PLAYBACK_ID}.m3u8`,
    embedUrl: `https://stream.mux.com/${EXPERIENCE_VIDEO_PLAYBACK_ID}`,
  });

  return (
    <>
      <JsonLd data={videoSchema} />
      <PageBanner title="About ULES" tagline="Learn more about ULES, our mission and values." />
      <Reveal>
        <WhoWeAre />
      </Reveal>
      <Reveal>
        <AboutVideo />
      </Reveal>
      <Reveal>
        <OurMissionAndVision />
      </Reveal>
      <Reveal>
        <OurCoreValues />
      </Reveal>
      <Reveal>
        <FAQs />
      </Reveal>
    </>
  );
}
