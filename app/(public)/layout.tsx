import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NewsBanner } from '@/components/layout/NewsBanner';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <NewsBanner />
      {children}
      <Footer />
    </>
  );
}
