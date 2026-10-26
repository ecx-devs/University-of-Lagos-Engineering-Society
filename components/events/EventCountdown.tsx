'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface EventCountdownProps {
  targetDate: string | Date;
  className?: string;
  variant?: 'card' | 'hero' | 'pill';
}

function calculateRemaining(targetTime: number) {
  const diff = targetTime - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function EventCountdown({ targetDate, className = '', variant = 'hero' }: EventCountdownProps) {
  const [remaining, setRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) return;

    setRemaining(calculateRemaining(target));

    const interval = setInterval(() => {
      setRemaining(calculateRemaining(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isClient) {
    return null;
  }


  if (!remaining) {
    if (variant === 'card' || variant === 'pill') return null;
    return (
      <div className={`inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 ${className}`}>
        <Clock className="h-4 w-4 text-slate-500" />
        <span>Event Concluded</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = remaining;


  if (variant === 'card' || variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg bg-[#0B0324] px-3 py-1.5 text-xs font-medium text-white shadow-xl border border-white/20 backdrop-blur-md ${className}`}
      >
        <Clock className="h-3.5 w-3.5 text-[#F97316] shrink-0" />
        <span className="font-mono tabular-nums tracking-wide font-bold text-white">
          {days > 0 ? `${days}d ` : ''}
          {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s
        </span>
      </div>
    );
  }


  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#170A51] px-6 py-4 text-white shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
        <h3 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-white shrink-0">
          Commencing In
        </h3>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
          <div className="flex min-w-[56px] sm:min-w-[66px] flex-col items-center justify-center rounded-xl bg-white/[0.08] border border-white/15 px-2.5 py-1.5 sm:px-3 sm:py-2 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
              {String(days).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Days
            </span>
          </div>

          <span className="font-heading text-lg sm:text-xl text-white/30 select-none -mt-2">:</span>

          <div className="flex min-w-[56px] sm:min-w-[66px] flex-col items-center justify-center rounded-xl bg-white/[0.08] border border-white/15 px-2.5 py-1.5 sm:px-3 sm:py-2 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Hours
            </span>
          </div>

          <span className="font-heading text-lg sm:text-xl text-white/30 select-none -mt-2">:</span>

          <div className="flex min-w-[56px] sm:min-w-[66px] flex-col items-center justify-center rounded-xl bg-white/[0.08] border border-white/15 px-2.5 py-1.5 sm:px-3 sm:py-2 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Mins
            </span>
          </div>

          <span className="font-heading text-lg sm:text-xl text-white/30 select-none -mt-2">:</span>

          <div className="flex min-w-[56px] sm:min-w-[66px] flex-col items-center justify-center rounded-xl bg-white/[0.08] border border-white/15 px-2.5 py-1.5 sm:px-3 sm:py-2 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Secs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
