import { ArrowRight } from 'lucide-react';

export interface NewsCardDetails {
  date: string;
  title: string;
  description: string;
  readMoreHref?: string;
  onReadMoreClick?: () => void;
}

interface NewsCardProps {
  details: NewsCardDetails;
  imageUrl: string;
  imageAlt?: string;
}

export default function NewsCard({ details, imageUrl, imageAlt = '' }: NewsCardProps) {
  const { date, title, description, readMoreHref, onReadMoreClick } = details;

  return (
    <div className="mx-auto w-full max-w-148 overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:mx-0">
      
      <div className="aspect-16/10 w-full overflow-hidden">
        <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
      </div>

      
      <div className="space-y-3 p-6">
        <p className="text-sm font-medium text-primary">{date}</p>

        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>

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
