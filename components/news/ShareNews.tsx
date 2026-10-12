'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FacebookIcon, LinkedinIcon, TwitterIcon } from '@/components/icons';



type ShareNewsProps = {
  title: string;
  
  url: string;
  
  label?: string;
};

const COPIED_RESET_MS = 2000;

export function ShareNews({ title, url, label = 'Share news' }: ShareNewsProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  const targets = [


    {
      name: 'X (formerly Twitter)',
      Icon: TwitterIcon,
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'LinkedIn',
      Icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch {


      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {


    }
  }, [title, url]);

  return (
    <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="ghost"
        onClick={handleShare}
        className="h-14 w-full gap-2 rounded-lg bg-secondary text-base/6 font-normal text-foreground hover:bg-secondary/80 sm:w-54.25"
      >
        <Share2 className="size-5 shrink-0" aria-hidden="true" />
        
        <span aria-live="polite">{copied ? 'Link copied' : label}</span>
      </Button>

      <ul className="flex gap-3">
        {targets.map(({ name, Icon, href }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${name} (opens in a new tab)`}
              title={`Share on ${name}`}
              className="flex size-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-secondary [&_path]:stroke-gray-700"
            >
              <Icon className="size-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
