import Image from 'next/image';
import { CURRENT_ACADEMIC_SESSION } from '@/components/constants';

const Welcome = () => {
  return (
    <section
      className="xs:px-[4.1%] w-full px-4 py-40 sm:py-24 md:px-[4.5%] lg:px-[4%] xl:px-[6.8233%]"
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, #170A51 0%, #22203E 100%)',
      }}
    >
      <div className="grid grid-cols-1 items-center gap-x-[1.931%] gap-y-10.75 lg:grid-cols-[649fr_400fr] lg:items-start xl:grid-cols-[649fr_540fr]">
        <div className="font-sans text-white">
          <h2 className="font-heading inline-block w-fit text-center text-[18px] leading-11 tracking-[-2%] md:text-[36px]">
            Welcome Message
          </h2>
          <div className="mt-6 text-sm leading-5 font-medium tracking-[0%] lg:text-base/[29.25px] lg:font-semibold xl:text-[18px]/[29.25px]">
            Welcome to the official digital home of the University of Lagos Engineering Society
            (ULES).
            <span className="mt-3 block lg:mt-0">
              On behalf of the Executive Council, it is my distinct honor to welcome you to the
              official platform of the University of Lagos Engineering Society (ULES). As students
              of this prestigious Faculty, we are bound by a Constitution that envisions a community
              rooted in unity, integrity, and leadership. Our mission is to ensure that your time
              here is defined by more than just academic rigor. We are here to provide the
              educational and cultural resources necessary to help you transition from a student
              into a world-class professional.
            </span>
            <span className="mt-3 block lg:mt-0">
              The {CURRENT_ACADEMIC_SESSION} session is dedicated to upholding our fundamental objectives: advocating
              for your academic rights, fostering cordial relationships with university
              administration, and creating high-impact opportunities for mentorship and hands-on
              development.
            </span>
            <span className="mt-3 block lg:mt-0">
              We are a society that believes in innovation and brotherhood. Whether you are a fresh
              student navigating your first year student or a finalist preparing for the industry,
              ULES is your primary representative body, committed to your welfare and your progress.
            </span>
            <span className="mt-3 block lg:mt-0">
              Let us work together to contribute our quota to the development of our fatherland and
              humanity at large. Explore our resources, engage with our programs, and let us
              continue to build a healthy and progressive faculty.
            </span>
            <span className="mt-3 block lg:mt-0">Greatest ULESsites!</span>
            <span className="mt-3 block lg:mt-0">Warm regards,</span>
          </div>
          <p className="mt-3 text-sm leading-5 font-medium tracking-[0%] italic lg:text-[18px] lg:leading-[29.25px] lg:font-normal">
            Damilare Aribisala,
            <br />
            <span className="mt-3 block lg:mt-0">
              President, University of Lagos Engineering Society (ULES), 2026/2027 Academic Session
            </span>
          </p>
        </div>

        <div className="flex justify-center lg:justify-end lg:pt-20">
          <div className="relative aspect-[533.71/667.09] w-full max-w-89.5 rotate-[0.99deg] border-15 border-white shadow-xl lg:max-w-[533.71px]">
            <Image
              src="/home/dree.jpg"
              alt="Damilare Aribisala, President of ULES"
              fill
              sizes="(min-width: 1024px) 534px, 80vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
