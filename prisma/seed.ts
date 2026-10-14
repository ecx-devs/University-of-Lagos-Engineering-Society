import { PrismaClient } from '@prisma/client';
import { NEWS_ITEMS } from '../components/constants/news';

const prisma = new PrismaClient();

const CATEGORY_MAP: Record<string, string> = {
  'ules-digest-issue-14': 'Campus Life',
  'ules-digest-issue-13': 'Innovation',
  'ules-digest-issue-12': 'Academic',
  'ules-digest-issue-11': 'Academic',
  'ules-digest-issue-10': 'Campus Life',
  'ules-digest-issue-9': 'Academic',
  'ules-digest-issue-8': 'Campus Life',
  'ules-digest-issue-7': 'Campus Life',
  'ules-digest-issue-6': 'Campus Life',
  'ules-digest-issue-5': 'Academic',
  'ules-digest-issue-4': 'Academic',
  'ules-digest-issue-3': 'Innovation',
  'ules-digest-issue-2': 'Digest',
  'ules-digest-issue-1': 'Digest',
};

async function main() {
  console.log(`Updating ${NEWS_ITEMS.length} news items with categories...`);

  for (const item of NEWS_ITEMS) {
    const category = CATEGORY_MAP[item.slug] || 'Digest';
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: {
        title: item.details.title,
        description: item.details.description,
        date: item.details.date,
        body: item.details.body,
        imageUrl: item.imageUrl,
        imageAlt: item.imageAlt,
        category,
        isPublished: true,
      },
      create: {
        slug: item.slug,
        title: item.details.title,
        description: item.details.description,
        date: item.details.date,
        body: item.details.body,
        imageUrl: item.imageUrl,
        imageAlt: item.imageAlt,
        category,
        isPublished: true,
      },
    });
    console.log(`✓ Seeded news item [${category}]: ${item.slug}`);
  }

  const count = await prisma.news.count();
  console.log(`Successfully updated! Total news items in database: ${count}`);
}

main()
  .catch((e) => {
    console.error('Error seeding news items:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
