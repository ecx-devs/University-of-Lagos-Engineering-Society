import { PageBanner } from '@/components/section/PageBanner';
import { DepartmentalBodies } from '@/components/association/DepartmentalBody';
import { SubBodies } from '@/components/association/SubBody';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const metadata = pageMetadata({
  title: 'Associations',
  description:
    "The nine departmental bodies and six sub-bodies that make up ULES, from NIMechE and SEES to PAADC and the Engineering Ladies Initiative.",
  path: '/associations',
  keywords: ['ULES departmental bodies', 'NIMechE UNILAG', 'SEES UNILAG', 'NSChE UNILAG', 'ULES sub bodies'],
});

export default function Associations() {
  return (
    <>
      <PageBanner
        title="Departmental Bodies"
        tagline="Departmental bodies representing engineering students across various disciplines"
        id="departmental"
      />
      <Reveal>
        <DepartmentalBodies />
      </Reveal>
      <PageBanner
        title="Sub Bodies"
        tagline="Professional bodies representing engineering students across various disciplines"
        id="sub"
      />
      <Reveal>
        <SubBodies />
      </Reveal>
    </>
  );
}
