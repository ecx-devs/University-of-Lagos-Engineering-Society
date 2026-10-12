import { ArrowRight } from 'lucide-react';

export interface BlogCardDetails {
  release: string;
  title: string;
  author: string;
  date: string;
  description: string;
  readMoreHref?: string;
  onReadMoreClick?: () => void;
}

interface BlogCardProps {
  details: BlogCardDetails;
  imageUrl: string;
  imageAlt?: string;
}

export default function BlogCard({ details, imageUrl, imageAlt = '' }: BlogCardProps) {
  const { release, title, author, date, description, readMoreHref, onReadMoreClick } = details;

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:mx-0">
      
      <div className="aspect-4/3 w-full overflow-hidden">
        <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
      </div>

      
      <div className="space-y-2 p-6">
        <p className="text-sm font-medium text-primary">{release}</p>

        <h3 className="text-xl leading-snug font-semibold text-foreground sm:text-2xl">{title}</h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>By {author}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{date}</span>
        </div>

        <p className="text-foreground">{description}</p>

        <a
          href={readMoreHref ?? '#'}
          onClick={onReadMoreClick}
          className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          Read More
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
