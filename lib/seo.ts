import type { Metadata } from 'next';

import { SITE_URL } from '@/components/constants';



export const SITE = {
  name: 'ULES',
  fullName: 'University of Lagos Engineering Society',
  url: process.env.NEXT_PUBLIC_SITE_URL || SITE_URL,
  description:
    'The University of Lagos Engineering Society (ULES) is the premier student body representing over 6,000 engineering students across 10 departments in the Faculty of Engineering, UNILAG.',
  locale: 'en_NG',
  twitter: '@_ulesofficial',
  email: 'unilagengr@gmail.com',
} as const;


const BASE_KEYWORDS = [
  'ULES',
  'University of Lagos Engineering Society',
  'UNILAG Engineering',
  'Faculty of Engineering UNILAG',
  'engineering students Nigeria',
  'UNILAG Akoka',
  'Nigerian engineering society',
];

type PageSeoOptions = {
  title: string;
  description: string;
  
  path: string;
  
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
};


export function pageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  type = 'website',
  publishedTime,
  authors,
}: PageSeoOptions): Metadata {
  const url = `${SITE.url}${path}`;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;

  return {
    title,
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.fullName,
      locale: SITE.locale,
      type,
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE.name}`,
      description,
      site: SITE.twitter,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}







export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/ules-logo.png`,
    email: SITE.email,
    foundingDate: '1964',
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Faculty of Engineering, University of Lagos, Akoka',
      addressLocality: 'Yaba',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'University of Lagos',
      url: 'https://unilag.edu.ng',
    },
    sameAs: [
      'https://www.instagram.com/ules_official',
      'https://x.com/_ulesofficial',
      'https://www.tiktok.com/@official_ules24',
      'https://www.youtube.com/channel/UC7yj9k4JjAVo7PGkjQi4N1w',
      'https://ng.linkedin.com/company/theunilagengineer',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.fullName,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en-NG',
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  datePublished,
  author,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}${path}` },
    ...(image ? { image: [`${SITE.url}${image}`] } : {}),
    ...(datePublished ? { datePublished } : {}),
    author: { '@type': author ? 'Person' : 'Organization', name: author ?? SITE.fullName },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function eventJsonLd({
  name,
  description,
  path,
  image,
  startDate,
  venue,
}: {
  name: string;
  description: string;
  path: string;
  image?: string;
  startDate?: string;
  venue?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    url: `${SITE.url}${path}`,
    ...(image ? { image: [`${SITE.url}${image}`] } : {}),
    ...(startDate ? { startDate } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: venue ?? 'Faculty of Engineering, University of Lagos',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Akoka, Yaba',
        addressRegion: 'Lagos',
        addressCountry: 'NG',
      },
    },
    organizer: { '@id': `${SITE.url}/#organization` },
  };
}

export function associationJsonLd({
  name,
  description,
  path,
  image,
  foundingDate,
}: {
  name: string;
  description: string;
  path: string;
  image?: string;
  foundingDate?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name,
    description,
    url: `${SITE.url}${path}`,
    ...(image ? { logo: `${SITE.url}${image}`, image: `${SITE.url}${image}` } : {}),
    ...(foundingDate ? { foundingDate } : {}),
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: SITE.fullName,
      url: SITE.url,
    },
  };
}

export function leadershipJsonLd(
  leaders: Array<{
    name: string;
    title: string;
    department?: string;
    email?: string;
    phoneNumber?: string;
    imageUrl?: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'ULES Executive Council & Leadership',
    description:
      'Official leadership directory of the University of Lagos Engineering Society (ULES) Executive Council representing over 6,000 engineering students.',
    url: `${SITE.url}/about/leadership`,
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: SITE.fullName,
      alternateName: SITE.name,
      url: SITE.url,
      member: leaders.map((leader) => ({
        '@type': 'Person',
        name: leader.name,
        jobTitle: leader.title,
        ...(leader.department
          ? { worksFor: { '@type': 'EducationalOrganization', name: `${leader.department}, UNILAG` } }
          : {}),
        ...(leader.email ? { email: leader.email } : {}),
        ...(leader.phoneNumber ? { telephone: leader.phoneNumber } : {}),
        ...(leader.imageUrl
          ? {
              image: leader.imageUrl.startsWith('http')
                ? leader.imageUrl
                : `${SITE.url}${leader.imageUrl}`,
            }
          : {}),
      })),
    },
  };
}

