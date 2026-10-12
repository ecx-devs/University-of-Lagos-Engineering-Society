import { BodyCard } from './BodyCard';
import { SUB_BODIES } from '../constants';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export function SubBodies() {
  return (
    <section className="xs:px-[4.2%] px-4 py-28.25 lg:px-[4.5%] xl:px-[7.75%]">
      
      <Stagger className="3xl:gap-x-4 grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] justify-items-center gap-x-4 gap-y-8 2xl:gap-x-3.5">
        {SUB_BODIES.map((body) => (
          <StaggerItem
            key={body.id}
            className="xs:max-w-90 sm:max-w-97.25 xl:max-w-88 2xl:max-w-97.25 h-full w-full md:max-w-85"
          >
            <BodyCard {...body} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
