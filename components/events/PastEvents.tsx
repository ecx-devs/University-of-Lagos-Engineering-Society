import EventCard from '@/components/ui/eventCard';

interface PastEventsProps {
  events?: any[];
}

const PastEvents = ({ events = [] }: PastEventsProps) => {
  return (
    <section className="bg-muted px-4 py-8 md:py-10 lg:px-[4.5%] lg:py-16 xl:px-[7.778%]">
      <h2 className="text-center font-sans text-2xl leading-tight font-medium text-[#1A2B56] sm:text-[26px] lg:text-3xl/9">
        Past Events
      </h2>
      {events.length === 0 ? (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          No past events recorded yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
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
      )}
    </section>
  );
};

export default PastEvents;
