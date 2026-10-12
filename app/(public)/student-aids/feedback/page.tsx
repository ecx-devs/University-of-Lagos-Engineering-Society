import { PageBanner } from '@/components/section/PageBanner';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'Share Feedback',
  description:
    "Tell the ULES executive council how we can serve the Faculty of Engineering better. Anonymous feedback welcome.",
  path: '/student-aids/feedback',
  keywords: ['ULES feedback', 'ULES suggestions'],
});

export default function Feedback() {
  return (
    <>
      <PageBanner
        title="Share Feedback"
        tagline="Tell us how we can serve the faculty better"
      />
      <Reveal>
        <FeedbackForm />
      </Reveal>
    </>
  );
}
