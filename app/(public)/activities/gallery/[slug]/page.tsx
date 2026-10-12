import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Camera } from 'lucide-react';
import { getEventBySlug } from '@/app/actions/events';
import { GALLERY_ALBUMS } from '@/components/constants/gallery';
import { HIGHLIGHTED_EVENT_ITEMS } from '@/components/constants/events';
import { GalleryLightboxGrid } from '@/components/gallery/GalleryLightboxGrid';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbEvent = await getEventBySlug(slug);
  const fallbackAlbum = GALLERY_ALBUMS.find((item) => item.slug === slug);
  const title = dbEvent?.title || fallbackAlbum?.title;
  const coverImage = dbEvent?.coverImageUrl || fallbackAlbum?.coverImage;

  if (!title) return {};

  return pageMetadata({
    title: `${title} — Photo Gallery`,
    description: `Official photo gallery and event highlights from ${title} — University of Lagos Engineering Society (ULES).`,
    path: `/activities/gallery/${slug}`,
    image: coverImage,
    keywords: [
      'ULES gallery',
      title,
      'UNILAG engineering event photos'
    ]
  });
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event = await getEventBySlug(slug);

  if (!event) {
    const fallbackAlbum = GALLERY_ALBUMS.find((item) => item.slug === slug);
    const fallbackEvent = HIGHLIGHTED_EVENT_ITEMS.find((item) => item.slug === slug);

    if (fallbackAlbum || fallbackEvent) {
      const photos = (fallbackAlbum?.photos || []).map((p, idx) => ({
        id: `fb-${idx}`,
        eventId: 'fallback',
        imageUrl: p.src,
        alt: p.alt,
        createdAt: new Date()
      }));

      event = {
        id: 'fallback',
        slug,
        title: fallbackAlbum?.title || fallbackEvent?.details.title || 'Event Gallery',
        frequency: fallbackEvent?.details.category || 'Annual Event',
        date: new Date(fallbackEvent?.timestamp || Date.now()),
        time: fallbackEvent?.time || '',
        venue: fallbackEvent?.venue || 'UNILAG Campus',
        description: fallbackEvent?.details.description || '',
        coverImageUrl: fallbackAlbum?.coverImage || fallbackEvent?.imageUrl || '',
        galleryImages: photos,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          galleryImages: photos.length
        }
      } as any;
    }
  }

  if (!event) {
    notFound();
  }

  const { title, venue, galleryImages = [], frequency, coverImageUrl } = event;
  const eventDate = new Date(event.date);
  const formattedDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const photosList = galleryImages.map((img: any) => ({
    id: img.id,
    imageUrl: img.imageUrl || img.src,
    alt: `${title} photograph`,
    createdAt: img.createdAt
  }));

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-[#0A0D18] border-b border-white/[0.08] text-white">
        {coverImageUrl && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              src={coverImageUrl}
              alt=""
              className="h-full w-full object-cover scale-110 blur-3xl opacity-30 brightness-90 saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080A14]/85 via-[#0A0D18]/90 to-[#0A0D18]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(120,119,198,0.15),transparent_70%)]" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12 lg:px-[4.5%] xl:px-[7.778%]">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-7 border-b border-white/[0.08]">
            <Link
              href="/activities/gallery"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to All Galleries</span>
            </Link>

            <Link
              href={`/activities/events/${slug}`}
              className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:border-white/25 hover:bg-white/[0.1] hover:text-white shadow-xs"
            >
              <span>View Event Details & Program</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </Link>
          </div>

          <div className="mt-8 space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-emerald-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Photo Archive
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-white/80 backdrop-blur-sm">
                <Camera className="h-3 w-3 text-white/60" />
                {photosList.length} {photosList.length === 1 ? 'Photograph' : 'Photographs'}
              </span>
              {frequency && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-white/70 backdrop-blur-sm">
                  {frequency}
                </span>
              )}
            </div>

            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.03em] text-white leading-[1.12]">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs sm:text-sm text-slate-300/80">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/50" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {venue && (
                <>
                  <span className="text-white/20 select-none hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-white/50" />
                    <span>{venue}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="px-4 py-8 md:py-14 lg:px-[4.5%] xl:px-[7.778%] mx-auto max-w-7xl">
        <GalleryLightboxGrid
          photos={photosList}
          eventTitle={title}
        />
      </main>
    </div>
  );
}
