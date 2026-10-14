import type { MetadataRoute } from 'next';

import {
  BLOG_ITEMS,
  GALLERY_ALBUMS,
  HIGHLIGHTED_EVENT_ITEMS,
  NEWS_ITEMS,
  getAllBodies,
} from '@/components/constants';
import { SITE } from '@/lib/seo';

import { getAllNewsSlugs } from '@/app/actions/news';
import { getAllBlogSlugs } from '@/app/actions/blogs';

/**
 * Generated dynamically with database entries, so a new post or
 * digest is in the sitemap the moment it's published.
 *
 * `priority` is a hint, not a ranking lever: it only tells a crawler which of
 * *our own* pages matter most when it can't fetch everything.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // `as const` so `changeFrequency` keeps its literal type through the `.map`
  // below — otherwise it widens to `string` and stops matching Next's union.
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: '/', priority: 1, changeFrequency: 'weekly' },
    { url: '/about/ules', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/about/leadership', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/associations', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/activities/events', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/activities/gallery', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/stories/news', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/stories/blog', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/stories/newsletter', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { url: '/student-aids/feedback', priority: 0.5, changeFrequency: 'yearly' },
  ] as const).map((route) => ({ ...route, url: `${SITE.url}${route.url}`, lastModified: now }));

  const newsSlugs = await getAllNewsSlugs();
  const news: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE.url}/stories/news/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogSlugs = await getAllBlogSlugs();
  const blog: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE.url}/stories/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const events: MetadataRoute.Sitemap = HIGHLIGHTED_EVENT_ITEMS.map((item) => ({
    url: `${SITE.url}/activities/events/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const gallery: MetadataRoute.Sitemap = GALLERY_ALBUMS.map((album) => ({
    url: `${SITE.url}/activities/gallery/${album.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const associations: MetadataRoute.Sitemap = getAllBodies().map((body) => ({
    url: `${SITE.url}/associations/${body.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...news, ...blog, ...events, ...gallery, ...associations];
}

