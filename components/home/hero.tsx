import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="xs:px-6 relative top-0 left-0 m-0 flex min-h-[calc(100vh-66px)] w-full flex-col justify-end px-4 pb-23.5 sm:px-10 sm:pb-[clamp(2.5rem,9.24vh,6rem)] md:px-16 lg:px-[9.6528%]">
      <Image
        src="/home/headshot.jpeg"
        fill
        sizes="100vw"
        alt="Image of all executives"
        priority
        className="object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-290.5 font-sans text-primary-foreground">
        <div className="pl-[0.6454%]">
          <h1 className="font-heading xs:text-4xl max-w-full text-center text-[30px] leading-tight tracking-[-0.02em] sm:max-w-125 sm:text-5xl sm:leading-snug md:max-w-155 md:text-start md:text-[52px] lg:max-w-188.75 lg:text-[60px]/18">
            The University of Lagos Engineering Society
          </h1>
          <p className="mt-3 max-w-full text-center text-[14px] leading-relaxed font-normal tracking-normal text-[#E5E7EB] sm:mt-4 sm:max-w-125 sm:text-base md:max-w-155 md:text-start lg:mt-0 lg:max-w-3xl lg:text-lg/7">
            The University of Lagos Engineering Society (ULES) is the premier student-led
            organization representing the diverse and vibrant community of the Faculty of
            Engineering. More than just a faculty body, ULES serves as the bridge between rigorous
            academic theory and the fast-paced world of professional excellence.
          </p>

          <div className="mt-6 mb-1 flex flex-col items-center gap-2 sm:mt-8 sm:gap-3 md:flex-row md:items-start lg:mt-10.75 lg:mb-[23.8px]">
            <Link href="/contact">
              <Button className={'h-14 w-48.75 text-center text-base/6'}>Contact ULES</Button>
            </Link>
            <Link href="/about/ules">
              <Button
                variant={'outline'}
                className={'h-14 w-45 bg-transparent text-center text-base/6'}
              >
                Discover
              </Button>
            </Link>
          </div>
        </div>

        <div className="align-center rounded-5xl absolute z-10 grid w-full grid-cols-2 justify-center gap-3 border border-white/25 bg-transparent px-3 py-4 shadow-lg backdrop-blur-[2px] sm:relative sm:grid-cols-4 sm:gap-4 sm:px-5 sm:py-5.5 lg:gap-5">
          <div className="align-center flex flex-col justify-center text-center text-primary-foreground">
            <span className="font-heading text-3xl leading-tight tracking-normal sm:text-4xl md:text-5xl lg:text-6xl/15">
              10
            </span>
            <span className="font-sans text-[11px]/7 font-medium tracking-[0.7px] sm:text-xs lg:text-[14px]">
              DEPARTMENTS
            </span>
          </div>
          <div className="align-center flex flex-col justify-center text-center text-primary-foreground">
            <span className="font-heading text-3xl leading-tight tracking-normal sm:text-4xl md:text-5xl lg:text-6xl/15">
              6,000+
            </span>
            <span className="font-sans text-[11px]/7 font-medium tracking-[0.7px] sm:text-xs lg:text-[14px]">
              MEMBERS
            </span>
          </div>
          <div className="align-center flex flex-col justify-center text-center text-primary-foreground">
            <span className="font-heading text-3xl leading-tight tracking-normal sm:text-4xl md:text-5xl lg:text-6xl/15">
              62
            </span>
            <span className="font-sans text-[11px]/7 font-medium tracking-[0.7px] sm:text-xs lg:text-[14px]">
              YEARS OF EXCELLENCE
            </span>
          </div>
          <div className="align-center flex flex-col justify-center text-center text-primary-foreground">
            <span className="font-heading text-3xl leading-tight tracking-normal sm:text-4xl md:text-5xl lg:text-6xl/15">
              6
            </span>
            <span className="font-sans text-[11px]/7 font-medium tracking-[0.7px] sm:text-xs lg:text-[14px]">
              SUB BODIES
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
