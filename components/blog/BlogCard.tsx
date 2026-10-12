import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';



type BlogCardProps = {
  slug: string;
  details: {
    release: string;
    title: string;
    author: string;
    date: string;
    description: string;
  };
  imageUrl: string;
  imageAlt: string;
};

export function BlogCard({ slug, details, imageUrl, imageAlt }: BlogCardProps) {
  const { release, title, author, date, description } = details;

  return (
    <Link href={`/stories/blog/${slug}`} className="block h-full">
      <Card className="hover:border-accent hover-lift h-full gap-0 overflow-hidden rounded-lg border border-border bg-white p-0 shadow-none ring-0">
        
        <div className="relative aspect-2/1 w-full shrink-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="p-6">
          <p className="text-accent text-sm/5">{release}</p>

          <h3 className="text-primary mt-2 line-clamp-2 text-lg/7 font-medium">{title}</h3>

          <p className="mt-2 text-sm/5 text-foreground">
            By {author} <span aria-hidden="true">•</span> {date}
          </p>

          <p className="mt-3 line-clamp-2 text-sm/5 text-foreground">{description}</p>
        </div>
      </Card>
    </Link>
  );
}
