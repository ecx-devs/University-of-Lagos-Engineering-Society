import { BadgeIcon, TargetIcon } from '../../icons';
import { MissionAndVisionCard } from './ItemCard';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export function OurMissionAndVision() {
  return (
    <section className="xs:px-[4.1%] px-4 py-16 lg:px-[4.5%] xl:px-[7.778%]">
      <h2 className="text-primary mb-12 text-center text-2xl/9 font-medium md:text-3xl/9">
        Our Mission &amp; Vision
      </h2>
      <Stagger
        as="div"
        className="flex flex-col gap-x-[1.316%] gap-y-4 md:flex-row md:justify-between"
      >
        <StaggerItem as="div" className="md:flex-1">
          <MissionAndVisionCard
            title="Vision Statement"
            description={`
              The University of Lagos Engineering Society (ULES) aspires to foster an inclusive, innovative,
              and vibrant community of engineering students committed to academic excellence, personal growth,
              and professional development. By upholding the principles of unity, integrity, and leadership, ULES aims to
              empower its members to excel as engineers of the future and ambassadors of positive change in society.
            `}
            icon={<TargetIcon />}
          />
        </StaggerItem>
        <StaggerItem as="div" className="md:flex-1">
          <MissionAndVisionCard
            title="Mission Statement"
            description={`
              Our mission is to perpetuate the growth of our Association and promote the general welfare of students
              within a healthy and progressive faculty. We are committed to providing a platform to effectively utilize
              educational and cultural resources, fostering healthy relationships between students and staff, and
              promoting unity and brotherly coexistence. Ultimately, we strive to contribute our quota to the progress,
              dignity, and development of our fatherland and humanity at large.
            `}
            icon={<BadgeIcon />}
          />
        </StaggerItem>
      </Stagger>
    </section>
  );
}
