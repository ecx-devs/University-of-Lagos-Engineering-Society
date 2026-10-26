import Image from 'next/image';
import { CURRENT_ACADEMIC_SESSION } from '@/components/constants';

const Welcome = () => {
  return (
    <section
      className="xs:px-[4.1%] w-full px-4 py-16 sm:py-20 md:px-[4.5%] lg:px-[4%] lg:py-20 xl:px-[6.8233%]"
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, #170A51 0%, #22203E 100%)',
      }}
    >
      <div className="grid grid-cols-1 items-center gap-x-[3%] gap-y-10 lg:grid-cols-[620fr_420fr] lg:items-start xl:grid-cols-[640fr_460fr]">
        <div className="font-sans text-white">
          <h2 className="font-heading inline-block w-fit text-left text-[22px] font-bold leading-snug tracking-[-1%] mt-5 sm:mt-0 sm:text-[28px] md:text-[32px] lg:text-[34px]">
            Welcome Message
          </h2>
          <div className="mt-4 text-xs/[19px] font-normal tracking-[0%] text-white/90 sm:mt-5 sm:text-sm/[21px] lg:text-[14px]/[21.5px] xl:text-[14.5px]/[22px] space-y-2 sm:space-y-2.5">
            <p>
              Welcome to the official digital home of the University of Lagos Engineering Society (ULES).
            </p>
            <p>
              On behalf of the Executive Council, it is my distinct honor to welcome you to the official platform of the University of Lagos Engineering Society (ULES). As students of this prestigious Faculty, we are bound by a Constitution that envisions a community rooted in unity, integrity, and leadership. Our mission is to ensure that our student&apos;s journey here is defined by more than just academic rigor. We are here to provide the educational and cultural resources necessary to help our students transition from just a student into a world-class professional.
            </p>
            <p>
              The {CURRENT_ACADEMIC_SESSION} session is dedicated to upholding our fundamental objectives: advocating for your academic rights, fostering cordial relationships with university administration, and creating high-impact opportunities for mentorship and hands-on development.
            </p>
            <p>
              We are a society that believes in innovation and brotherhood. So whether you are a fresh student navigating your first year student, a returning student building their educational journey or a finalist preparing for the industry, ULES is your primary representative body, committed to your welfare and your progress.
            </p>
            <p>
              For brands, organisations and external bodies, our door is open too. Let us work together to contribute our quota to the development of our fatherland and humanity at large.
            </p>
            <p>
              Finally, I welcome you to explore our resources, engage with our programs, and let us continue to build a healthy and progressive faculty.
            </p>
            <p className="pt-0.5">Warm regards,</p>
          </div>
          <p className="mt-3 text-xs leading-5 font-medium tracking-[0%] italic text-white/95 sm:text-sm lg:text-[14px] lg:leading-[22px] lg:font-normal">
            Damilare Aribisala,
            <br />
            <span className="mt-0.5 block font-normal text-white/80 not-italic text-xs lg:text-[13px]">
              President, University of Lagos Engineering Society (ULES), 2026/2027 Academic Session
            </span>
          </p>
        </div>

        <div className="flex justify-center lg:justify-end lg:pt-2">
          <div className="relative aspect-[533.71/667.09] w-full max-w-89.5 rotate-[0.99deg] border-12 border-white shadow-xl sm:border-15 lg:max-w-[460px] xl:max-w-[490px]">
            <Image
              src="/home/drey.jpeg"
              alt="Damilare Aribisala, President of ULES"
              fill
              sizes="(min-width: 1024px) 490px, 80vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
