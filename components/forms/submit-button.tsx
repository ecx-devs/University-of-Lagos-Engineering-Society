import { Button } from '../ui/button';


export function SubmitButton({
  pending,
  pendingLabel,
  children,
  className = '',
}: {
  pending: boolean;
  pendingLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button type="submit" disabled={pending} className={`h-14 text-base/6 ${className}`}>
      {pending ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="mr-2 size-4 animate-spin motion-reduce:animate-none"
          >
            <circle cx="12" cy="12" r="9" className="opacity-25" />
            <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
          </svg>
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
