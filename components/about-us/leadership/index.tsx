import { ExcoCard } from './excoCard';
import { EXCOS_DATA } from '@/components/constants';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export function Excos() {
  return (
    <section className="xs:px-[4.2%] px-4 py-28.25 lg:px-[4.5%] xl:px-[7.75%]">
      <Stagger className="3xl:gap-x-4 flex flex-wrap justify-center gap-x-4 gap-y-8 2xl:gap-x-3.5">
        {EXCOS_DATA.map((exco) => (
          <StaggerItem key={exco.id} className="3xl:max-w-75 max-w-90 flex-[1_1_230px] md:max-w-75">
            <ExcoCard {...exco} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
