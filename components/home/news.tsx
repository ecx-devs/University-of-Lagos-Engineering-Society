import Link from 'next/link';
import { LucideArrowRight } from 'lucide-react';
import NewsCard from '@/components/ui/newsCard';
import { Button } from '@/components/ui/button';
import { HIGHLIGHTED_NEWS_ITEMS } from '../constants';

const News = () => {
  return (
    <div className="bg-white px-4 py-8 md:py-10 lg:px-[4.5%] lg:py-16 xl:px-[7.778%]">
      <div className="flex items-center justify-between gap-3 font-sans">
        <h1 className="text-2xl leading-tight font-medium text-[#1A2B56] sm:text-[26px] lg:text-3xl/9">
          <span className="xs:inline hidden">Latest </span>News
        </h1>
        <Link href="/stories/news">
          <Button
            variant={'ghost'}
            className="tracking-0 flex h-auto items-center gap-1 py-0 text-sm/6 text-[#1A2B56] sm:text-base"
          >
            View
            <span className="xs:inline hidden"> More </span>
            <span>
              <LucideArrowRight className="size-5" />
            </span>
          </Button>
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2">
        {HIGHLIGHTED_NEWS_ITEMS.map((item) => (
          <NewsCard
            key={item.id}
            details={item.details}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
          />
        ))}
      </div>
    </div>
  );
};

export default News;
