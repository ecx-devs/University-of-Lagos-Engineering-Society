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
  title: string | { absolute: string };
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
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${SITE.url}${image}`) : undefined;
  const rawTitle = typeof title === 'string' ? title : title.absolute;
  const ogTitle = typeof title === 'string' ? `${title} | ${SITE.name}` : title.absolute;
  const images = fullImageUrl ? [{ url: fullImageUrl, width: 1200, height: 630, alt: rawTitle }] : undefined;

  return {
    title,
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
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
      title: ogTitle,
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
  acronym,
  alternateNames = [],
  description,
  path,
  image,
  foundingDate,
  departmentAffiliation,
  leaderName,
  leaderTitle,
  contactEmail,
  socials,
  focusAreas,
  flagshipEvents,
}: {
  name: string;
  acronym?: string;
  alternateNames?: string[];
  description: string;
  path: string;
  image?: string;
  foundingDate?: string;
  departmentAffiliation?: string;
  leaderName?: string;
  leaderTitle?: string;
  contactEmail?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  focusAreas?: string[];
  flagshipEvents?: Array<{ name: string; description: string }>;
}) {
  const url = `${SITE.url}${path}`;
  const orgId = `${url}#organization`;
  const webpageId = `${url}#webpage`;
  const imageUrl = image ? (image.startsWith('http') ? image : `${SITE.url}${image}`) : undefined;

  const sameAs: string[] = [];
  if (socials?.instagram) sameAs.push(socials.instagram);
  if (socials?.twitter) sameAs.push(socials.twitter);
  if (socials?.linkedin) sameAs.push(socials.linkedin);

  const allAlternateNames = Array.from(
    new Set(
      [
        acronym,
        acronym ? `${acronym} ULES` : undefined,
        acronym ? `${acronym} UNILAG` : undefined,
        acronym ? `${acronym} University of Lagos` : undefined,
        ...(alternateNames || []),
      ].filter(Boolean) as string[]
    )
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': orgId,
        name,
        ...(allAlternateNames.length > 0 ? { alternateName: allAlternateNames } : {}),
        description,
        url,
        ...(imageUrl ? { logo: imageUrl, image: imageUrl } : {}),
        ...(foundingDate ? { foundingDate } : {}),
        ...(contactEmail ? { email: contactEmail } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        ...(focusAreas && focusAreas.length > 0 ? { knowsAbout: focusAreas } : {}),
        ...(departmentAffiliation
          ? {
              department: {
                '@type': 'Organization',
                name: departmentAffiliation,
              },
            }
          : {}),
        ...(leaderName
          ? {
              leader: {
                '@type': 'Person',
                name: leaderName,
                ...(leaderTitle ? { jobTitle: leaderTitle } : {}),
              },
            }
          : {}),
        parentOrganization: {
          '@type': 'EducationalOrganization',
          '@id': `${SITE.url}/#organization`,
          name: SITE.fullName,
          alternateName: SITE.name,
          url: SITE.url,
        },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url,
        name: `${name} | ${SITE.name} UNILAG`,
        description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE.url}/#website`,
        },
        about: { '@id': orgId },
        mainEntity: { '@id': orgId },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Associations',
            item: `${SITE.url}/associations`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: acronym || name,
            item: url,
          },
        ],
      },
      ...(flagshipEvents && flagshipEvents.length > 0
        ? flagshipEvents.map((evt, idx) => ({
            '@type': 'Event',
            '@id': `${url}#event-${idx + 1}`,
            name: evt.name,
            description: evt.description,
            organizer: { '@id': orgId },
            location: {
              '@type': 'Place',
              name: 'Faculty of Engineering, University of Lagos',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Akoka, Yaba',
                addressRegion: 'Lagos',
                addressCountry: 'NG',
              },
            },
          }))
        : []),
    ],
  };
}

export function associationsCollectionJsonLd(
  bodies: Array<{
    name: string;
    acronym: string;
    slug: string;
    tagline: string;
    imageSrc?: string;
  }>
) {
  const url = `${SITE.url}/associations`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: `Engineering Associations & Student Bodies | ${SITE.fullName}`,
        description:
          'Explore all 9 departmental bodies and 6 sub-bodies across the Faculty of Engineering at the University of Lagos (UNILAG) under ULES, including ECX, NISGS, NIMechE, SEES, and PAADC.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE.url}/#website`,
        },
        about: { '@id': `${SITE.url}/#organization` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: bodies.length,
          itemListElement: bodies.map((body, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${body.name} (${body.acronym}) - ${body.tagline}`,
            url: `${SITE.url}/associations/${body.slug}`,
            description: body.tagline,
            ...(body.imageSrc
              ? {
                  image: body.imageSrc.startsWith('http')
                    ? body.imageSrc
                    : `${SITE.url}${body.imageSrc}`,
                }
              : {}),
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Associations',
            item: url,
          },
        ],
      },
    ],
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

