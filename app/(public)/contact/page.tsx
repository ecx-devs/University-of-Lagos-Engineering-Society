import { PageBanner } from '@/components/section/PageBanner';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description:
    "Get in touch with the ULES team — for enquiries, sponsorships and partnerships with the University of Lagos Engineering Society.",
  path: '/contact',
  keywords: ['contact ULES', 'ULES sponsorship', 'ULES partnership'],
});

export default function ContactUs() {
  return (
    <>
      <PageBanner title="Contact Us" tagline="Get in touch with the ULES team" />
      <ContactInfo />
    </>
  );
}
