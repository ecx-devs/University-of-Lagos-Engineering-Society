import { redirect, RedirectType } from 'next/navigation';
import { PageBanner } from '@/components/section/PageBanner';
import { DepartmentalBodies } from '@/components/association/DepartmentalBody';
import { SubBodies } from '@/components/association/SubBody';
import { pageMetadata, associationsCollectionJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllBodies, getBodyBySlug } from '@/components/constants';

export const metadata = pageMetadata({
  title: 'Engineering Associations & Student Bodies | ULES UNILAG',
  description:
    'Directory of all 9 departmental bodies and 6 sub-bodies across the Faculty of Engineering at the University of Lagos (UNILAG) under ULES, including leadership, programs, and student activities.',
  path: '/associations',
  keywords: [
    'ULES departmental bodies',
    'ULES sub bodies',
    'UNILAG engineering associations',
    'Faculty of Engineering UNILAG',
    'UNILAG engineering student bodies',
    'engineering societies Lagos',
    'student engineering leadership UNILAG',
  ],
});

interface AssociationsPageProps {
  searchParams?: Promise<{ body?: string; slug?: string }>;
}

export default async function Associations({ searchParams }: AssociationsPageProps) {
  const params = await searchParams;
  const requested = params?.body || params?.slug;

  if (requested) {
    const target = getBodyBySlug(requested);
    if (target) {
      redirect(`/associations/${target.slug}`, RedirectType.replace);
    }
  }

  const allBodies = getAllBodies();

  return (
    <>
      <JsonLd data={associationsCollectionJsonLd(allBodies)} />
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
