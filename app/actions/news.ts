'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NEWS_ITEMS } from '@/components/constants/news';
import { deleteFromCloudinary } from '@/app/actions/upload';

export type NewsItemData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
  imageUrl: string;
  imageAlt?: string | null;
  category: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedNews = {
  items: NewsItemData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 1. Get paginated news with optional search & category filter
export async function getPaginatedNews({
  page = 1,
  pageSize = 6,
  publishedOnly = true,
  search = '',
  category = 'All',
}: {
  page?: number;
  pageSize?: number;
  publishedOnly?: boolean;
  search?: string;
  category?: string;
} = {}): Promise<PaginatedNews> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  try {
    const whereClause: any = {};
    if (publishedOnly) {
      whereClause.isPublished = true;
    }
    if (category && category !== 'All') {
      whereClause.category = category;
    }
    if (search.trim()) {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { body: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const items = await prisma.news.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safePageSize,
    });

    let total: number;
    if (skip === 0 && items.length < safePageSize) {
      total = items.length;
    } else {
      total = await prisma.news.count({ where: whereClause });
    }

    const totalPages = Math.max(1, Math.ceil(total / safePageSize));

    return {
      items: items.map((i) => ({ ...i, category: i.category || 'Digest' })),
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
    };
  } catch (error) {
    console.warn('Prisma news query failed or timed out:', (error as Error)?.message || error);
    return {
      items: [],
      total: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 1,
    };
  }
}

// 2. Get all news for admin management
export async function getAllAdminNews(): Promise<NewsItemData[]> {
  try {
    const list = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((i) => ({ ...i, category: i.category || 'Digest' }));
  } catch (error) {
    console.warn('Error fetching admin news from DB:', (error as Error)?.message || error);
    return [];
  }
}

// 3. Get single news item by slug
export async function getNewsBySlug(slug: string): Promise<NewsItemData | null> {
  try {
    const item = await prisma.news.findUnique({
      where: { slug },
    });

    if (item) {
      return { ...item, category: item.category || 'Digest' };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching news for slug ${slug}:`, error);
    return null;
  }
}

// 4. Get recent published news items
export async function getRecentNews(limit: number = 2): Promise<NewsItemData[]> {
  try {
    const items = await prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return items.map((i) => ({ ...i, category: i.category || 'Digest' }));
  } catch (error) {
    console.error('Error fetching recent news:', error);
    return [];
  }
}

// 5. Get all published slugs (for static paths & sitemap)
export async function getAllNewsSlugs(): Promise<string[]> {
  try {
    const news = await prisma.news.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return news.map((n) => n.slug);
  } catch (error) {
    console.error('Error fetching news slugs:', error);
    return [];
  }
}

// 6. Create or update news item
export async function createOrUpdateNews(data: {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  date: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  isPublished: boolean;
}): Promise<{ success: boolean; news?: NewsItemData; error?: string }> {
  try {
    const title = data.title.trim();
    if (!title) return { success: false, error: 'Title is required' };
    if (!data.description.trim()) return { success: false, error: 'Description is required' };
    if (!data.body.trim()) return { success: false, error: 'Body content is required' };

    let slug = data.slug?.trim() ? slugify(data.slug.trim()) : slugify(title);
    if (!slug) slug = `news-${Date.now()}`;

    const imageUrl = data.imageUrl?.trim() || '/news/default.png';
    const imageAlt = data.imageAlt?.trim() || title;
    const category = data.category?.trim() || 'Digest';
    const date = data.date?.trim() || new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    let savedItem: NewsItemData;

    if (data.id) {
      savedItem = await prisma.news.update({
        where: { id: data.id },
        data: {
          slug,
          title,
          description: data.description.trim(),
          date,
          body: data.body.trim(),
          imageUrl,
          imageAlt,
          category,
          isPublished: data.isPublished,
        },
      });
    } else {
      const existing = await prisma.news.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      savedItem = await prisma.news.create({
        data: {
          slug,
          title,
          description: data.description.trim(),
          date,
          body: data.body.trim(),
          imageUrl,
          imageAlt,
          category,
          isPublished: data.isPublished,
        },
      });
    }

    revalidatePath('/admin/news');
    revalidatePath('/admin');
    revalidatePath('/stories/news');
    revalidatePath(`/stories/news/${savedItem.slug}`);
    revalidatePath('/');
    revalidatePath('/', 'layout');
    revalidatePath('/sitemap.xml');

    return { success: true, news: savedItem };
  } catch (error: any) {
    console.error('Error saving news item:', error);
    return { success: false, error: error.message || 'Failed to save news item' };
  }
}

// 7. Toggle published status
export async function toggleNewsPublished(id: string, isPublished: boolean) {
  try {
    const item = await prisma.news.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath('/admin/news');
    revalidatePath('/admin');
    revalidatePath('/stories/news');
    revalidatePath(`/stories/news/${item.slug}`);
    revalidatePath('/');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling news published state:', error);
    return { success: false, error: error.message };
  }
}

// 8. Delete news item
export async function deleteNews(id: string) {
  try {
    const item = await prisma.news.delete({
      where: { id },
    });

    if (item?.imageUrl) {
      deleteFromCloudinary(item.imageUrl).catch((err) =>
        console.error('Failed to cleanup news image from Cloudinary:', err)
      );
    }

    revalidatePath('/admin/news');
    revalidatePath('/admin');
    revalidatePath('/stories/news');
    revalidatePath(`/stories/news/${item.slug}`);
    revalidatePath('/');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting news item:', error);
    return { success: false, error: error.message };
  }
}
