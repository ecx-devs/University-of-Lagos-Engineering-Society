import { PageBanner } from '@/components/section/PageBanner';
import { WhoWeAre } from '@/components/about-us/WhoWeAre';
import { OurMissionAndVision } from '@/components/about-us/MissionAndVision';
import { OurCoreValues } from '@/components/about-us/CoreValues';
import { FAQs } from '@/components/about-us/faqs';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'About ULES',
  description:
    "Learn who ULES is: our mission, vision, core values and answers to the questions engineering students at UNILAG ask most.",
  path: '/about/ules',
  keywords: ['about ULES', 'ULES mission', 'ULES core values', 'ULES FAQs'],
});

export default function AboutULES() {
  return (
    <>
      <PageBanner title="About ULES" tagline="Learn more about ULES, our mission and values." />
      <Reveal>
        <WhoWeAre />
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
