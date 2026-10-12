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
      className={`relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#1B0F4C] via-[#140A3C] to-[#0A0420] p-6 sm:p-8 text-white shadow-2xl ${className}`}
    >

      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#C85B15]/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#106333]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5 text-[#F97316]" />
            <span>Live Countdown</span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-white">
            Commencing In
          </h3>
        </div>


        <div className="flex items-center justify-center gap-1.5 sm:gap-3">

          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-white/[0.07] border border-white/15 px-3 py-3 sm:px-5 sm:py-4 min-w-[66px] sm:min-w-[88px] backdrop-blur-md shadow-lg text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-white tabular-nums leading-none drop-shadow-sm">
              {String(days).padStart(2, '0')}
            </span>
            <span className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E5A93C]">
              Days
            </span>
          </div>

          <span className="font-heading text-2xl sm:text-3xl text-white/25 -mt-3 select-none">:</span>


          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-white/[0.07] border border-white/15 px-3 py-3 sm:px-5 sm:py-4 min-w-[66px] sm:min-w-[88px] backdrop-blur-md shadow-lg text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-white tabular-nums leading-none drop-shadow-sm">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E5A93C]">
              Hours
            </span>
          </div>

          <span className="font-heading text-2xl sm:text-3xl text-white/25 -mt-3 select-none">:</span>


          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-white/[0.07] border border-white/15 px-3 py-3 sm:px-5 sm:py-4 min-w-[66px] sm:min-w-[88px] backdrop-blur-md shadow-lg text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-white tabular-nums leading-none drop-shadow-sm">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E5A93C]">
              Mins
            </span>
          </div>

          <span className="font-heading text-2xl sm:text-3xl text-white/25 -mt-3 select-none">:</span>


          <div className="relative flex flex-col items-center justify-center rounded-2xl bg-[#C85B15]/15 border border-[#C85B15]/40 px-3 py-3 sm:px-5 sm:py-4 min-w-[66px] sm:min-w-[88px] backdrop-blur-md shadow-lg text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-white tabular-nums leading-none drop-shadow-sm">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#F97316]">
              Secs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
