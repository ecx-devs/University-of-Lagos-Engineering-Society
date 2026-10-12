import { PageBanner } from '@/components/section/PageBanner';
import { AlbumGrid } from '@/components/gallery/AlbumGrid';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { getGalleryEvents } from '@/app/actions/events';

export const metadata = pageMetadata({
  title: 'Gallery',
  description: 'High-resolution photos from ULES programmes, summits, and activities across the Faculty of Engineering, University of Lagos.',
  path: '/activities/gallery',
  keywords: [
    'ULES gallery',
    'ULES photos',
    'UNILAG engineering photo album',
    'Engineering Week gallery'
  ]
});

export const revalidate = 60;

export default async function GalleryPage() {
  const galleryEvents = await getGalleryEvents();

  return (
    <>
      <PageBanner
        title="Gallery"
        tagline="Explore moments and photo memories from programs of the University of Lagos Engineering Society"
      />
      <Reveal>
        <AlbumGrid events={galleryEvents} />
      </Reveal>
    </>
  );
}