'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    

    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  if (status === 'success') {
    return (
      <div className="flex animate-in fade-in zoom-in-95 items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-200">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
        <span>Subscribed! Keep an eye on your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full flex-col">
      <div className="relative flex w-full items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          disabled={status === 'loading'}
          className="h-9 w-full rounded-md border border-white/15 bg-white/5 pl-3 pr-10 text-xs text-white placeholder:text-white/40 outline-none transition-all focus:border-white/40 focus:bg-white/10 focus:ring-1 focus:ring-white/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="absolute right-1 flex size-7 items-center justify-center rounded bg-accent text-white transition-all hover:brightness-110 disabled:opacity-50"
          aria-label="Subscribe"
        >
          {status === 'loading' ? (
            <div className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <ArrowRight className="size-3.5" />
          )}
        </button>
      </div>
    </form>
  );
}
