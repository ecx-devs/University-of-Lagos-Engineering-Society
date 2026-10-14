'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkedinIcon, TwitterIcon, WhatsAppIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

type ShareBlogProps = {
  title: string;
  url: string;
  label?: string;
};

const COPIED_RESET_MS = 2500;

export function ShareBlog({ title, url, label = 'Share article' }: ShareBlogProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const shareText = `${title} — ULES Blog`;

  const targets = [
    {
      name: 'X (formerly Twitter)',
      Icon: TwitterIcon,
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      Icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      Icon: WhatsAppIcon,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\nRead more: ${url}`)}`,
    },
  ];

  const handleCopyLink = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
    }
  }, [url]);

  const handleShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareText, text: shareText, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    handleCopyLink();
  }, [handleCopyLink, shareText, url]);

  return (
    <div className="mt-12 flex flex-col gap-6 border-t border-slate-200/80 pt-8 md:flex-row md:items-center md:justify-between font-sans">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={handleShare}
          className="h-11 sm:h-12 px-5 gap-2 rounded-xl bg-[#170A51] text-white hover:bg-white hover:text-[#170A51] border border-[#170A51] text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer"
        >
          <Share2 className="size-4 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleCopyLink}
          className={cn(
            'h-11 sm:h-12 px-5 gap-2 rounded-xl text-sm font-semibold transition-all duration-200 border shadow-xs cursor-pointer',
            copied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800'
              : 'bg-white text-[#170A51] border-[#170A51]/30 hover:bg-[#170A51] hover:border-[#170A51]'
          )}
        >
          {copied ? (
            <>
              <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span aria-live="polite">Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="size-4 shrink-0" aria-hidden="true" />
              <span>Copy link</span>
            </>
          )}
        </Button>
      </div>

      {/* Social Sharing Icons */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">
          Share to:
        </span>
        <ul className="flex items-center gap-2.5">
          {targets.map(({ name, Icon, href }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${name} (opens in a new window)`}
                title={`Share on ${name}`}
                className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-[#170A51] border border-slate-200/80 transition-all duration-200 hover:bg-[#170A51] hover:text-white hover:border-[#170A51] hover:scale-105 shadow-2xs"
              >
                <Icon className="size-4.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
