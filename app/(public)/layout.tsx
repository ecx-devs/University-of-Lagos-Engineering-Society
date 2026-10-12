import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventCountdownBanner } from '@/components/layout/EventCountdownBanner';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <EventCountdownBanner />
      {children}
      <Footer />
    </>
  );
}
