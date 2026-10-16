import { AlbumCard } from '@/components/gallery/AlbumCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

interface AlbumGridProps {
  events?: any[];
}

export function AlbumGrid({ events = [] }: AlbumGridProps) {
  return (
    <section className="px-section py-8 md:py-10 lg:py-16">
      {events.length === 0 ? (
        <EmptyState
          icon="gallery"
          badge="Photo Albums"
          title="No photo albums published yet"
          description="We haven't published any event photo sets yet. Photo albums capturing high-energy campus events, summits, and celebrations will appear here."
          action={{
            label: 'Browse Events',
            href: '/activities/events',
          }}
        />
      ) : (
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const photoCount =
              event.galleryImages?.length || event._count?.galleryImages || 0;

            return (
              <StaggerItem key={event.id}>
                <AlbumCard
                  slug={event.slug}
                  title={event.title}
                  coverImage={event.coverImageUrl}
                  coverAlt={event.title}
                  photoCount={photoCount}
                />
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </section>
  );
}
