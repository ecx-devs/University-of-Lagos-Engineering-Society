import Link from 'next/link';
import { LucideArrowRight } from 'lucide-react';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { getRecentBlogPosts } from '@/app/actions/blogs';

export default async function Blog() {
  const recentPosts = await getRecentBlogPosts(3);

  return (
    <div className="bg-muted/50 px-4 py-8 md:py-10 lg:px-[4.5%] lg:py-16 xl:px-[7.778%]">
      <div className="flex items-center justify-between gap-3 font-sans">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C85B15]">
            Stories & Insights
          </span>
          <h2 className="text-2xl/tight font-medium text-[#1A2B56] sm:text-[26px] lg:text-3xl/9 mt-0.5">
            <span className="xs:inline hidden">From The </span>
            ULES Blog
          </h2>
        </div>
        <Link href="/stories/blog">
          <Button
            variant={'ghost'}
            className="tracking-0 flex h-auto items-center gap-1 py-0 text-sm/6 text-[hsl(223,54%,22%)] sm:text-base hover:text-[#C85B15] cursor-pointer"
          >
            View
            <span className="xs:inline hidden"> All Posts </span>
            <span>
              <LucideArrowRight className="size-5" />
            </span>
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {recentPosts.map((post) => (
          <BlogCard
            key={post.id}
            slug={post.slug}
            category={post.category}
            details={{
              release: post.release,
              title: post.title,
              author: post.author,
              authorPfp: post.authorPfp,
              date: post.date,
              readTime: post.readTime,
              description: post.description,
            }}
            imageUrl={post.imageUrl}
            imageAlt={post.imageAlt || post.title}
          />
        ))}
      </div>
    </div>
  );
}
