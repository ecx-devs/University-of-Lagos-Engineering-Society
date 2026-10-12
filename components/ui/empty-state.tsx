

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center">
      <h2 className="text-primary text-xl/7 font-medium">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-base/6">{description}</p>
    </div>
  );
}
