
export function CharacterCount({
  value,
  max,
  warnWithin = 100,
}: {
  value: number;
  max: number;
  warnWithin?: number;
}) {
  const warning = value > max - warnWithin;
  return (
    <span
      aria-hidden="true"
      className={`ml-auto shrink-0 text-sm/5 tabular-nums ${
        warning ? 'text-destructive' : 'text-muted-foreground'
      }`}
    >
      {value.toLocaleString()} / {max.toLocaleString()}
    </span>
  );
}
