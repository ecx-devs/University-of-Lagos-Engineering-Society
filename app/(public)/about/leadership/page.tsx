import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Excos, ExcosSkeleton } from '@/components/about-us/leadership';
import { PageBanner } from '@/components/section/PageBanner';
import { pageMetadata, leadershipJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { getPublicExecutiveLeaders } from '@/app/actions/leadership';
import { getGlobalAcademicSession } from '@/app/actions/associations';

export const revalidate = 60; // Revalidate every minute for fast cache + fresh updates

export async function generateMetadata(): Promise<Metadata> {
  const [leaders, session] = await Promise.all([
    getPublicExecutiveLeaders(),
    getGlobalAcademicSession(),
  ]);

  // Extract titles and names for high-ranking SEO searches (e.g., "ULES Social Secretary")
  const roleKeywords = leaders.flatMap((l) => [
    `ULES ${l.title}`,
    `${l.title} ULES`,
    `${l.name} ULES`,
    `${l.name} ${l.title}`,
  ]);

  const topRolesSummary = leaders
    .slice(0, 5)
    .map((l) => `${l.title} (${l.name})`)
    .join(', ');

  const description =
    leaders.length > 0
      ? `Meet the University of Lagos Engineering Society (ULES) Executive Council for the ${session} session: ${topRolesSummary}, and all executive officers representing over 6,000 engineering students at UNILAG.`
      : `Meet the ULES Executive Council — the elected students representing the Faculty of Engineering at the University of Lagos (UNILAG) for the ${session} session.`;

  return pageMetadata({
    title: 'Executive Council & Leadership',
    description,
    path: '/about/leadership',
    keywords: [
      'ULES EXCO',
      'ULES executives',
      'ULES leadership',
      'ULES executive council',
      'UNILAG engineering executives',
      'Faculty of Engineering UNILAG leadership',
      'ULES President',
      'ULES Social Secretary',
      'ULES Vice President',
      'ULES General Secretary',
      'ULES Public Relations Officer',
      'University of Lagos Engineering Society leadership',
      ...roleKeywords,
    ],
  });
}

export default async function AboutLeadership() {
  const [leaders, session] = await Promise.all([
    getPublicExecutiveLeaders(),
    getGlobalAcademicSession(),
  ]);
  const jsonLd = leadershipJsonLd(leaders);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageBanner
        title="Executive Council"
        tagline={`Meet the executive leaders representing the ${session} tenure across the Faculty of Engineering`}
      />

      <Reveal>
        <Suspense fallback={<ExcosSkeleton />}>
          <Excos leaders={leaders} />
        </Suspense>
      </Reveal>
    </>
  );
}


