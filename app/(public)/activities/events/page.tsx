import { PageBanner } from '@/components/section/PageBanner';
import PastEvents from '@/components/events/PastEvents';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { getUpcomingEvents, getPastEvents } from '@/app/actions/events';

export const metadata = pageMetadata({
  title: 'Events',
  description:
    "Every ULES programme and activity — from the Sports Festival and Quadtopia to Dinner & Awards and Freshers' Orientation.",
  path: '/activities/events',
  keywords: ['ULES events', 'ULES Sports Festival', 'Quadtopia', 'ULES Dinner and Awards'],
});

export const revalidate = 60; // Revalidate every minute

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <>
      <PageBanner
        title="Events"
        tagline="See all programs and activities of the University of Lagos Engineering Society"
      />
      <Reveal>
        <UpcomingEvents events={upcomingEvents} />
      </Reveal>
      <Reveal>
        <PastEvents events={pastEvents} />
      </Reveal>
    </>
  );
}
