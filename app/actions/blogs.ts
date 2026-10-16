'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { INITIAL_BLOG_POSTS, type BlogPostItem } from '@/components/constants/blogs';

export type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  release: string;
  category: string;
  author: string;
  authorBio: string;
  authorPfp?: string | null;
  date: string;
  readTime: string;
  description: string;
  body: string;
  imageUrl: string;
  imageAlt?: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedBlogPosts = {
  items: BlogPostData[];
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

function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function sanitizeAuthorPfp(pfp?: string | null): string {
  if (!pfp || pfp.trim() === '' || pfp.includes('ules-author')) {
    return '/logo/logo-transparent.png';
  }
  return pfp;
}

function normalizeBlogPostItem<T extends { authorPfp?: string | null; category?: string | null; release?: string | null }>(
  item: T
): T & { authorPfp: string; category: string; release: string } {
  return {
    ...item,
    category: item.category || 'Campus Life',
    release: item.release || 'Release #01',
    authorPfp: sanitizeAuthorPfp(item.authorPfp),
  };
}

function mapFallbackPost(post: BlogPostItem): BlogPostData {
  return {
    id: String(post.id),
    slug: post.slug,
    title: post.details.title,
    release: post.details.release || 'Release #01',
    category: post.category || 'Campus Life',
    author: post.details.author || 'ULES Editorial',
    authorBio:
      post.details.authorBio ||
      'The official voice and stories from the University of Lagos Engineering Society.',
    authorPfp: sanitizeAuthorPfp(post.details.authorPfp),
    date: post.details.date,
    readTime: post.details.readTime || calculateReadTime(post.details.body),
    description: post.details.description,
    body: post.details.body,
    imageUrl: post.imageUrl || '/blogs/my-first-love-letter.jpeg',
    imageAlt: post.imageAlt || post.details.title,
    isPublished: post.isPublished ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

let initialSeedAttempted = false;

async function ensureInitialSeed() {
  if (initialSeedAttempted) return;
  initialSeedAttempted = true;

  try {
    await prisma.blogPost.updateMany({
      where: {
        OR: [
          { authorPfp: { contains: 'ules-author' } },
          { authorPfp: null },
          { authorPfp: '' },
        ],
      },
      data: {
        authorPfp: '/logo/logo-transparent.png',
      },
    });
  } catch (err) {
    console.warn('Initial blog post pfp hygiene check bypassed or DB unavailable:', err);
  }
}

// 1. Get paginated blog posts with category and search filtering
export async function getPaginatedBlogPosts({
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
} = {}): Promise<PaginatedBlogPosts> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  try {
    await ensureInitialSeed();

    const whereClause: any = {};
    if (publishedOnly) {
      whereClause.isPublished = true;
    }
    if (category && category !== 'All') {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }
    if (search.trim()) {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { body: { contains: search.trim(), mode: 'insensitive' } },
        { author: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const items = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safePageSize,
    });

    const total = await prisma.blogPost.count({ where: whereClause });
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));

    return {
      items: items.map(normalizeBlogPostItem),
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
    };
  } catch (error) {
    console.warn('Prisma blog query failed or timed out:', (error as Error)?.message || error);
    return {
      items: [],
      total: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 1,
    };
  }
}

// 2. Get all blog posts for admin management
export async function getAllAdminBlogPosts(): Promise<BlogPostData[]> {
  try {
    await ensureInitialSeed();
    const list = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(normalizeBlogPostItem);
  } catch (error) {
    console.warn('Error fetching admin blog posts from DB:', (error as Error)?.message || error);
    return [];
  }
}

// 3. Get single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
  try {
    await ensureInitialSeed();
    const item = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (item) {
      return normalizeBlogPostItem(item);
    }

    return null;
  } catch (error) {
    console.error(`Error fetching blog post for slug ${slug}:`, error);
    return null;
  }
}

// 4. Get recent published blog posts
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPostData[]> {
  try {
    await ensureInitialSeed();
    const items = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return items.map(normalizeBlogPostItem);
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    return [];
  }
}

// 5. Get all published blog slugs (for static params & sitemap)
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    await ensureInitialSeed();
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

// 6. Create or update blog post
export async function createOrUpdateBlogPost(data: {
  id?: string;
  slug?: string;
  title: string;
  release?: string;
  category?: string;
  author?: string;
  authorBio?: string;
  authorPfp?: string;
  date?: string;
  readTime?: string;
  description: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  isPublished: boolean;
}): Promise<{ success: boolean; post?: BlogPostData; error?: string }> {
  try {
    const title = data.title.trim();
    if (!title) return { success: false, error: 'Title is required' };
    if (!data.description.trim()) return { success: false, error: 'Summary/Description is required' };
    if (!data.body.trim()) return { success: false, error: 'Article body is required' };

    let slug = data.slug?.trim() ? slugify(data.slug.trim()) : slugify(title);
    if (!slug) slug = `blog-${Date.now()}`;

    const release = data.release?.trim() || 'Release #01';
    const category = data.category?.trim() || 'Campus Life';
    const author = data.author?.trim() || 'ULES Editorial';
    const authorBio =
      data.authorBio?.trim() ||
      'The official voice and stories from the University of Lagos Engineering Society.';
    const authorPfp = sanitizeAuthorPfp(data.authorPfp?.trim());
    const date =
      data.date?.trim() ||
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    const readTime = data.readTime?.trim() || calculateReadTime(data.body);
    const imageUrl = data.imageUrl?.trim() || '/blogs/my-first-love-letter.jpeg';
    const imageAlt = data.imageAlt?.trim() || title;

    let savedItem: BlogPostData;

    if (data.id) {
      savedItem = await prisma.blogPost.update({
        where: { id: data.id },
        data: {
          slug,
          title,
          release,
          category,
          author,
          authorBio,
          authorPfp,
          date,
          readTime,
          description: data.description.trim(),
          body: data.body.trim(),
          imageUrl,
          imageAlt,
          isPublished: data.isPublished,
        },
      });
    } else {
      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      savedItem = await prisma.blogPost.create({
        data: {
          slug,
          title,
          release,
          category,
          author,
          authorBio,
          authorPfp,
          date,
          readTime,
          description: data.description.trim(),
          body: data.body.trim(),
          imageUrl,
          imageAlt,
          isPublished: data.isPublished,
        },
      });
    }

    revalidatePath('/admin/blog');
    revalidatePath('/admin');
    revalidatePath('/stories/blog');
    revalidatePath(`/stories/blog/${savedItem.slug}`);
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return { success: true, post: savedItem };
  } catch (error: any) {
    console.error('Error saving blog post:', error);
    return { success: false, error: error.message || 'Failed to save blog post' };
  }
}

// 7. Toggle published status
export async function toggleBlogPostPublished(id: string, isPublished: boolean) {
  try {
    const item = await prisma.blogPost.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/admin');
    revalidatePath('/stories/blog');
    revalidatePath(`/stories/blog/${item.slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling blog post published state:', error);
    return { success: false, error: error.message };
  }
}

// 8. Delete blog post
export async function deleteBlogPost(id: string) {
  try {
    const item = await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/admin');
    revalidatePath('/stories/blog');
    revalidatePath(`/stories/blog/${item.slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: error.message };
  }
}
