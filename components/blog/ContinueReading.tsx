import { ArrowUpRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';



type ContinueReadingProps = {
  
  href: string;
  children: React.ReactNode;
};

export function ContinueReading({ href, children }: ContinueReadingProps) {
  return (
    <>
      <div className="relative max-h-112 overflow-hidden">
        {children}

        <div
          aria-hidden="true"
          className="from-background via-background/85 pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t to-transparent"
        />
      </div>

      <div className="w-full rounded-lg border border-border bg-muted px-4 py-8 text-center md:px-8">
        <h2 className="text-primary text-lg/7 font-medium">There&apos;s more where that came from</h2>
        <p className="mx-auto mt-2 max-w-md text-base/6 text-foreground">
          The rest of this post and every issue we publish are lives on the ULES Substack.
        </p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), 'mt-6 h-12 gap-2 px-6 text-base/6')}
        >
          Click to continue reading
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">(opens ulesblog.substack.com in a new tab)</span>
        </a>
      </div>
    </>
  );
}
