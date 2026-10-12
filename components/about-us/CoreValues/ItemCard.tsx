type CoreValuesCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function CoreValuesCard({ title, description, icon }: CoreValuesCardProps) {
  return (
    <div className="rounded-lg border border-border py-9.5 pr-4.5 pl-8">
      <div className="mb-4.5 flex items-end gap-4">
        <span className="[&>svg]:size-10">{icon}</span>
        <h3 className="text-primary text-2xl/8 font-semibold">{title}</h3>
      </div>
      <p className="text-base/6 text-foreground">{description}</p>
    </div>
  );
}
