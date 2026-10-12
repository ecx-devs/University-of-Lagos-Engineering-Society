import Link from 'next/link';
import { Cog } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="px-section flex min-h-[60vh] flex-col items-center justify-center py-16 text-center md:py-20 lg:py-24">
        <p
          className="text-primary flex items-center gap-2 font-medium tracking-tight md:gap-3"
          aria-label="404"
          role="img"
        >
          <span aria-hidden="true" className="text-7xl/none md:text-8xl/none lg:text-9xl/none">
            4
          </span>
          <Cog
            aria-hidden="true"
            strokeWidth={1.5}
            className="text-accent animate-spin-slow size-16 shrink-0 md:size-20 lg:size-28"
          />
          <span aria-hidden="true" className="text-7xl/none md:text-8xl/none lg:text-9xl/none">
            4
          </span>
        </p>

        <h1 className="text-primary mt-8 text-2xl/9 font-medium md:text-3xl/9">
          This page isn&apos;t in the faculty
        </h1>

        <p className="mx-auto mt-3 max-w-md text-base/6 text-foreground lg:text-lg/7">
          The link may be broken, or the page may have moved. Nothing you did — let&apos;s get you
          back on track.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/" className={cn(buttonVariants(), 'h-12 px-6 text-base/6')}>
            Back to home
          </Link>
          <Link
            href="/student-aids/feedback"
            className={cn(buttonVariants({ variant: 'outline' }), 'h-12 px-6 text-base/6')}
          >
            Report a broken link
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
