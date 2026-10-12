'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { HIGHLIGHTED_EVENT_ITEMS } from '@/components/constants';
import { cn, isEventPast } from '@/lib/utils';




const EVENT_SLUG = 'dinner-awards-2026';

type Phase = 'upcoming' | 'live' | 'concluded';

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function breakdown(ms: number): Remaining {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function resolvePhase(timestamp: string): Phase {
  if (isEventPast(timestamp)) return 'concluded';
  return Date.now() >= new Date(timestamp).getTime() ? 'live' : 'upcoming';
}

const TONE: Record<Phase, { bar: string; dot: string; pulse: boolean }> = {
  upcoming: { bar: 'bg-accent hover:bg-accent/90 text-white', dot: 'bg-white', pulse: true },
  live: { bar: 'bg-primary hover:bg-primary/90 text-white', dot: 'bg-accent', pulse: true },
  concluded: {
    bar: 'bg-muted hover:bg-secondary text-primary hover:text-white',
    dot: 'bg-secondary/80 group-hover:bg-white',
    pulse: false,
  },
};

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="font-mono text-sm/5 font-semibold tabular-nums md:text-base/6">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px]/4 uppercase opacity-80 md:text-xs/4">{label}</span>
    </span>
  );
}

export function EventCountdownBanner() {
  const event = HIGHLIGHTED_EVENT_ITEMS.find((item) => item.slug === EVENT_SLUG);
  const timestamp = event?.timestamp;

  const [phase, setPhase] = useState<Phase | null>(null);
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!timestamp) return;

    const target = new Date(timestamp).getTime();

    const tick = () => {
      const next = resolvePhase(timestamp);
      setPhase(next);


      setRemaining(next === 'upcoming' ? breakdown(target - Date.now()) : null);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timestamp]);

  if (!event || phase === null) return null;

  const tone = TONE[phase];

  return (
    <motion.div
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/activities/events/${event.slug}`}
        className={cn(
          'group focus-visible:ring-ring/60 flex w-full items-center justify-center gap-3 px-4 py-2.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-inset md:gap-4 md:py-3',
          tone.bar,
        )}
      >
        <span className="relative flex size-2 shrink-0">
          {tone.pulse && !reduceMotion && (
            <span
              className={cn(
                'absolute inline-flex size-full animate-ping rounded-full opacity-75',
                tone.dot,
              )}
            />
          )}
          <span className={cn('relative inline-flex size-2 rounded-full', tone.dot)} />
        </span>

        <span className="truncate text-sm/5 font-medium md:text-base/6">
          <span className="hidden sm:inline">{event.details.title}</span>
          <span className="sm:hidden">Dinner &amp; Awards</span>
        </span>

        <span aria-hidden="true" className="hidden h-4 w-px bg-current/40 sm:block" />

        {phase === 'upcoming' && remaining ? (
          <span
            className="flex shrink-0 items-baseline gap-2 md:gap-3"
            aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds remaining`}
          >
            <Unit value={remaining.days} label="d" />
            <Unit value={remaining.hours} label="h" />
            <Unit value={remaining.minutes} label="m" />
            <Unit value={remaining.seconds} label="s" />
          </span>
        ) : (
          <span className="shrink-0 text-sm/5 font-semibold md:text-base/6">
            {phase === 'live' ? 'Event in progress' : 'Event concluded'}
          </span>
        )}

        <ArrowRight
          aria-hidden="true"
          className="hidden size-4 shrink-0 transition-transform group-hover:translate-x-1 md:block"
        />
      </Link>
    </motion.div>
  );
}
