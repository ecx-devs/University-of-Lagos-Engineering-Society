import Image from 'next/image';
import type { PageBannerProps } from '../types';

export function PageBanner({ id, title, tagline }: PageBannerProps) {
  return (
    <section id={id} className="relative isolate overflow-hidden px-[9.8264%] py-16 text-center">
      <Image
        src="/banner.png"
        alt="Page Banner"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <h1 className="mb-6 space-y-9 text-4xl/11 font-medium tracking-[-0.02em] text-primary-foreground lg:space-y-12 lg:text-5xl/15">
        {title}
      </h1>
      <p className="text-xl/7 font-normal text-primary-foreground">{tagline}</p>
    </section>
  );
}
