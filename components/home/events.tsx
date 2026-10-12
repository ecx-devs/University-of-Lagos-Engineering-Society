import Link from 'next/link';
import { LucideArrowRight } from 'lucide-react';
import EventCard from '@/components/ui/eventCard';
import { Button } from '@/components/ui/button';
import { getUpcomingEvents } from '@/app/actions/events';
import { HIGHLIGHTED_EVENT_ITEMS } from '../constants';

const Events = async () => {
  let upcomingEvents: any[] = await getUpcomingEvents();


  if (!upcomingEvents || upcomingEvents.length === 0) {
    upcomingEvents = HIGHLIGHTED_EVENT_ITEMS.slice(0, 3).map((item) => ({
      id: String(item.id),
      slug: item.slug,
      title: item.details.title,
      frequency: item.details.category,
      date: new Date(item.timestamp),
      description: item.details.shortAbout,
      coverImageUrl: item.imageUrl,
      galleryImages: [],
      _count: { galleryImages: 0 },
    }));
  }

  const displayedEvents = upcomingEvents.slice(0, 3);

  return (
    <section className="bg-muted px-4 py-8 md:py-10 lg:px-[4.5%] lg:py-16 xl:px-[7.778%]">
      <div className="flex items-center justify-between gap-3 font-sans">
        <h2 className="text-2xl leading-tight font-medium text-[#1A2B56] sm:text-[26px] lg:text-3xl/9">
          <span className="xs:inline hidden">Upcoming </span>
          Events
        </h2>
        <Link href="/activities/events">
          <Button
            variant="ghost"
            className="tracking-0 flex h-auto items-center gap-1 py-0 text-sm/6 text-[#1A2B56] sm:text-base font-medium hover:text-[#C85B15]"
          >
            View
            <span className="xs:inline hidden"> All </span>
            <span>
              <LucideArrowRight className="size-5" />
            </span>
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {displayedEvents.map((event: any) => {
          const eventDate = new Date(event.date);
          const dateStr = !isNaN(eventDate.getTime())
            ? eventDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : '';

          const hasGallery =
            (event.galleryImages?.length || event._count?.galleryImages || 0) > 0;

          return (
            <EventCard
              key={event.id}
              id={event.id}
              slug={event.slug}
              title={event.title}
              frequency={event.frequency}
              date={dateStr}
              description={event.description}
              imageUrl={event.coverImageUrl}
              imageAlt={event.title}
              hasGallery={hasGallery}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Events;
