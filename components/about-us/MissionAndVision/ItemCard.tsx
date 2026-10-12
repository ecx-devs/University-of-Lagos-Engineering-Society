type MissionAndVisionCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function MissionAndVisionCard({ title, description, icon }: MissionAndVisionCardProps) {
  return (
    <div className="rounded-lg border border-border py-8 pr-[3.9106%] pl-[8.9385%] md:pr-8 md:pl-8">
      <span className="bg-accent flex size-16 items-center justify-center rounded-full [&>svg]:size-8">
        {icon}
      </span>
      <h3 className="text-primary my-6 text-xl/8 font-medium md:text-2xl/8">{title}</h3>
      <p className="text-sm/6 font-normal text-foreground md:text-base/6">{description}</p>
    </div>
  );
}
