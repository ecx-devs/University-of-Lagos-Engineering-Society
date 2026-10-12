import Link from 'next/link';
import { LucideArrowRight } from 'lucide-react';
import BlogCard from '@/components/ui/blogCard';
import { Button } from '@/components/ui/button';
import { BLOG_ITEMS } from '../constants';

const Blog = () => {
  return (
    <div className="bg-muted px-4 py-8 md:py-10 lg:px-[4.5%] lg:py-16 xl:px-[7.778%]">
      <div className="flex items-center justify-between gap-3 font-sans">
        <h1 className="text-2xl/tight font-medium text-[#1A2B56] sm:text-[26px] lg:text-3xl/9">
          <span className="xs:inline hidden">From The </span>
          Blog
        </h1>
        <Link href='/stories/blog'>
          <Button
            variant={'ghost'}
            className="tracking-0 flex h-auto items-center gap-1 py-0 text-sm/6 text-[hsl(223,54%,22%)] sm:text-base"
          >
            View
            <span className="xs:inline hidden"> More </span>
            <span>
              <LucideArrowRight className="size-5" />
            </span>
          </Button>
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_ITEMS.map((post) => (
          <BlogCard
            key={post.id}
            details={post.details}
            imageUrl={post.imageUrl}
            imageAlt={post.imageAlt}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
