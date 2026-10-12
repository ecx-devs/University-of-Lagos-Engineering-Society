import Link from 'next/link';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { EventCountdown } from '@/components/events/EventCountdown';

export interface EventCardDetails {
  category?: string;
  title?: string;
  date?: string;
  description?: string;
  learnMoreHref?: string;
}

export interface EventCardProps {
  id?: string;
  slug?: string;
  title?: string;
  frequency?: string;
  date?: string;
  targetDate?: string | Date;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  hasGallery?: boolean;
  details?: EventCardDetails;
}

export default function EventCard({
  id,
  slug: propSlug,
  title: propTitle,
  frequency: propFrequency,
  date: propDate,
  targetDate,
  description: propDescription,
  imageUrl,
  imageAlt = '',
  hasGallery = false,
  details,
}: EventCardProps) {

  const title = propTitle || details?.title || 'Event';
  const frequency = propFrequency || details?.category || 'Event';
  const date = propDate || details?.date || '';
  const description = propDescription || details?.description || '';


  let slug = propSlug;
  if (!slug && details?.learnMoreHref) {
    const parts = details.learnMoreHref.split('/');
    slug = parts[parts.length - 1];
  }
  const eventHref = slug ? `/activities/events/${slug}` : '#';
  const galleryHref = slug ? `/activities/gallery/${slug}` : '#';

  const isUpcoming = targetDate ? new Date(targetDate).getTime() > Date.now() : false;

  return (
    <div className="group mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 sm:mx-0">

      <Link href={eventHref} className="relative aspect-4/3 w-full overflow-hidden bg-muted block">
        <img
          src={imageUrl}
          alt={imageAlt || title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {isUpcoming && targetDate && (
          <div className="absolute top-3 right-3 z-10 shadow-md">
            <EventCountdown targetDate={targetDate} variant="pill" />
          </div>
        )}
      </Link>


      <div className="flex flex-1 flex-col justify-between p-6 space-y-3">
        <div className="space-y-3">

          <div className="flex items-center justify-between gap-2">
            <span className="inline-block rounded-md bg-[#106333]/10 px-2.5 py-0.5 text-xs font-semibold text-[#106333]">
              {frequency}
            </span>
            {hasGallery && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C85B15]">
                <ImageIcon className="h-3 w-3" />
                Photos Available
              </span>
            )}
          </div>


          <Link href={eventHref} className="block group/title">
            <h3 className="text-xl font-bold text-foreground transition-colors group-hover/title:text-[#106333] sm:text-2xl leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>


          {date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-[#C85B15] shrink-0" />
              <span>{date}</span>
            </div>
          )}


          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>


        {hasGallery && (
          <div className="pt-3 border-t border-border/60">
            <Link
              href={galleryHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C85B15] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#a6480e] hover:shadow active:scale-[0.98]"
            >
              <ImageIcon className="h-4 w-4" />
              View Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
