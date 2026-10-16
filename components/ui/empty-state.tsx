import React from 'react';
import Link from 'next/link';
import {
  LucideIcon,
  ArrowRight,
  Sparkles,
  CalendarDays,
  CalendarCheck2,
  Newspaper,
  BookOpen,
  Images,
  Camera,
  SearchX,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmptyStateIconType =
  | LucideIcon
  | React.ComponentType<{ className?: string }>
  | 'calendar'
  | 'calendar-check'
  | 'news'
  | 'blog'
  | 'gallery'
  | 'camera'
  | 'search'
  | 'clock'
  | 'sparkles';

export type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  variant?: 'primary' | 'outline' | 'secondary' | 'accent';
};

export type EmptyStateProps = {
  title: string;
  description?: string;
  message?: string;
  icon?: EmptyStateIconType;
  badge?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  children?: React.ReactNode;
  compact?: boolean;
  className?: string;
  iconClassName?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  'calendar-check': CalendarCheck2,
  news: Newspaper,
  blog: BookOpen,
  gallery: Images,
  camera: Camera,
  search: SearchX,
  clock: Clock,
  sparkles: Sparkles,
};

export function EmptyState({
  title,
  description,
  message,
  icon = 'sparkles',
  badge,
  action,
  secondaryAction,
  children,
  compact = false,
  className,
  iconClassName,
}: EmptyStateProps) {
  const descText = description || message;

  const IconComponent: LucideIcon | React.ComponentType<{ className?: string }> =
    typeof icon === 'string' ? ICON_MAP[icon] || Sparkles : icon || Sparkles;

  const renderAction = (act: EmptyStateAction, isPrimary: boolean) => {
    const ActIcon = act.icon || ArrowRight;
    const variant = act.variant || (isPrimary ? 'primary' : 'outline');

    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none';
    const sizeClasses = compact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5';

    let variantClasses = '';
    if (variant === 'accent') {
      variantClasses =
        'bg-[#C85B15] text-white shadow-xs hover:bg-[#a8490e] hover:shadow-md hover:-translate-y-0.5';
    } else if (variant === 'primary') {
      variantClasses =
        'bg-[#170A51] text-white shadow-xs hover:bg-[#22203E] hover:shadow-md hover:-translate-y-0.5';
    } else if (variant === 'secondary') {
      variantClasses =
        'bg-[#106333] text-white shadow-xs hover:bg-[#0c4e28] hover:shadow-md hover:-translate-y-0.5';
    } else {
      variantClasses =
        'border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900';
    }

    const buttonClasses = cn(baseClasses, sizeClasses, variantClasses);

    if (act.href) {
      return (
        <Link key={act.label} href={act.href} className={buttonClasses}>
          <span>{act.label}</span>
          <ActIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      );
    }

    return (
      <button key={act.label} type="button" onClick={act.onClick} className={buttonClasses}>
        <span>{act.label}</span>
        <ActIcon className="size-4 shrink-0" />
      </button>
    );
  };

  return (
    <div
      className={cn(
        'group relative w-full max-w-3xl mx-auto overflow-hidden rounded-[2rem] border border-dashed border-slate-300/80 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-center shadow-xs transition-all duration-300 hover:border-slate-400/80 hover:shadow-md',
        compact ? 'py-10 px-4 sm:py-12 sm:px-6' : 'py-12 px-6 sm:py-16 sm:px-10',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-40 bg-gradient-to-b from-[#170A51]/5 via-[#C85B15]/5 to-transparent blur-3xl rounded-full opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 right-1/4 w-60 h-32 bg-[#106333]/5 blur-2xl rounded-full opacity-50"
      />

      <div className="relative mx-auto mb-5 flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#170A51]/10 via-[#106333]/10 to-[#C85B15]/15 blur-lg opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
        />

        <div
          className={cn(
            'relative flex items-center justify-center rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:shadow-md backdrop-blur-xs',
            compact ? 'size-16 sm:size-18' : 'size-20 sm:size-22'
          )}
        >
          <IconComponent
            className={cn(
              'text-[#1A2B56] transition-colors duration-300 group-hover:text-[#C85B15]',
              compact ? 'size-7 sm:size-8' : 'size-9 sm:size-10',
              iconClassName
            )}
          />
        </div>
      </div>

      {badge && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-medium text-slate-700 shadow-2xs backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-[#106333]" />
          <span>{badge}</span>
        </div>
      )}

      <h3
        className={cn(
          'font-sans font-medium text-[#1A2B56] leading-tight',
          compact ? 'text-lg sm:text-xl' : 'text-2xl sm:text-[26px]'
        )}
      >
        {title}
      </h3>

      {descText && (
        <p
          className={cn(
            'mx-auto mt-2.5 text-slate-500 leading-relaxed font-normal',
            compact ? 'max-w-md text-xs sm:text-sm' : 'max-w-lg text-sm sm:text-base'
          )}
        >
          {descText}
        </p>
      )}

      {(action || secondaryAction || children) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-1">
          {action && renderAction(action, true)}
          {secondaryAction && renderAction(secondaryAction, false)}
          {children}
        </div>
      )}
    </div>
  );
}
