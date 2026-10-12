'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyEmailButtonProps {
  email: string;
}

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {

    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
      title="Copy email address"
      aria-label="Copy email address"
    >
      {copied ? (
        <>
          <Check className="size-3 text-primary" aria-hidden="true" />
          <span className="text-primary font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3" aria-hidden="true" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
