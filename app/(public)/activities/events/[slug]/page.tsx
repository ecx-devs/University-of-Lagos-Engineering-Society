import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, Image as ImageIcon, Camera } from 'lucide-react';
import { getEventBySlug } from '@/app/actions/events';
import { HIGHLIGHTED_EVENT_ITEMS } from '@/components/constants/events';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageMetadata, eventJsonLd } from '@/lib/seo';
import { EventCountdown } from '@/components/events/EventCountdown';
import { EmptyState } from '@/components/ui/empty-state';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbEvent = await getEventBySlug(slug);
  const fallback = HIGHLIGHTED_EVENT_ITEMS.find((event) => event.slug === slug);
  const title = dbEvent?.title || fallback?.details.title;
  const description = dbEvent?.description || fallback?.details.description;
  const image = dbEvent?.coverImageUrl || fallback?.imageUrl;

  if (!title) return {};

  return pageMetadata({
    title,
    description: description?.split('\n')[0]?.trim() || '',
    path: `/activities/events/${slug}`,
    image,
    keywords: ['ULES events', title]
  });
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event = await getEventBySlug(slug);

  if (!event) {
    const fallback = HIGHLIGHTED_EVENT_ITEMS.find((item) => item.slug === slug);
    if (fallback) {
      event = {
        id: String(fallback.id),
        slug: fallback.slug,
        title: fallback.details.title,
        frequency: fallback.details.category || 'Annual Event',
        date: new Date(fallback.timestamp),
        time: fallback.time,
        venue: fallback.venue,
        description: fallback.details.description,
        coverImageUrl: fallback.imageUrl,
        galleryImages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          galleryImages: 0
        }
      } as any;
    }
  }

  if (!event) {
    notFound();
  }

  const { title, frequency, venue, description, coverImageUrl, galleryImages = [] } = event;
  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;
  const formattedDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const aboutParagraphs = description.split('\n').map((paragraph: string) => paragraph.trim()).filter(Boolean);
  const hasGallery = galleryImages.length > 0;
  const galleryHref = `/activities/gallery/${slug}`;
  const previewThumbnails = galleryImages.slice(0, 6);

  return (
    <>
      <JsonLd
        data={eventJsonLd({
          name: title,
          description: aboutParagraphs[0] ?? '',
          path: `/activities/events/${slug}`,
          image: coverImageUrl,
          startDate: eventDate.toISOString(),
          venue
        })}
      />

      <div className="border-b border-border bg-white px-4 py-4 lg:px-[4.5%] xl:px-[7.778%]">
        <Link
          href="/activities/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1A2B56] transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </div>

      <div className="bg-white px-4 py-8 md:py-10 lg:px-[4.5%] lg:py-12 xl:px-[7.778%]">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-block rounded-full px-3.5 py-1 text-xs font-semibold ${
              isPast
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isPast ? 'Past Event' : 'Upcoming Event'}
          </span>
          <span className="inline-block rounded-full bg-[#106333]/10 px-3.5 py-1 text-xs font-semibold text-[#106333]">
            {frequency}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#170A51] sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-slate-50/70 p-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#106333] text-white shadow-sm">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</p>
              <p className="font-semibold text-[#170A51] text-sm sm:text-base">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#106333] text-white shadow-sm">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</p>
              <p className="font-semibold text-[#170A51] text-sm sm:text-base">{event.time || 'TBA'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#106333] text-white shadow-sm">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Venue</p>
              <p className="font-semibold text-[#170A51] text-sm sm:text-base">{venue}</p>
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="mt-6">
            <EventCountdown targetDate={event.date} variant="hero" />
          </div>
        )}

        <div className="relative mt-8 aspect-16/7 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <img
            src={coverImageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          {hasGallery && (
            <Link
              href={galleryHref}
              className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-lg bg-[#C85B15] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#a6480e]"
            >
              <ImageIcon className="h-4 w-4" />
              View Full Gallery ({galleryImages.length})
            </Link>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#170A51] sm:text-3xl">About This Event</h2>
          <div className="mt-4 space-y-4 whitespace-pre-line text-base leading-relaxed text-[#170A51]/90">
            {aboutParagraphs.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div id="gallery" className="mt-14 rounded-2xl border border-border bg-slate-50/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#170A51]">Gallery Preview</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {hasGallery
                  ? `Showing photos captured for ${title}.`
                  : 'Official photos and highlights for this event.'}
              </p>
            </div>
            {hasGallery && (
              <span className="text-xs font-semibold text-[#C85B15] uppercase tracking-wider">
                {galleryImages.length} Photos in Album
              </span>
            )}
          </div>

          {hasGallery ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {previewThumbnails.map((photo: any, index: number) => (
                  <Link
                    key={photo.id || index}
                    href={galleryHref}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted shadow-xs transition-transform hover:scale-[1.03]"
                  >
                    <img
                      src={photo.imageUrl || photo.src}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Link href={galleryHref}>
                  <Button className="bg-[#C85B15] hover:bg-[#a6480e] text-white px-8 py-3 text-sm font-semibold rounded-lg shadow-sm">
                    View All Photos ({galleryImages.length})
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              icon="camera"
              badge="Media Pending"
              title="No photos uploaded yet"
              description="Photos are yet to be uploaded for this event. Check back soon as the media team updates the collection."
              compact
            />
          )}
        </div>
      </div>
    </>
  );
}