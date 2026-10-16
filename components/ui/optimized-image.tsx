'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  containerClassName?: string;
  fallbackSrc?: string;
}

/**
 * Optimized Next.js Image with:
 * 1. Automatic Cloudinary optimization (f_auto, q_auto, w_1600, c_limit)
 * 2. Elegant skeleton loading shimmer
 * 3. Smooth fade-in transition on load
 * 4. Error fallback handling
 */
export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = '/logo/logo-transparent.png',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const rawSrc = error || !src ? fallbackSrc : src;

  // On-the-fly Cloudinary optimization for any Cloudinary image (new or historical)
  const finalSrc =
    typeof rawSrc === 'string' &&
    rawSrc.includes('res.cloudinary.com') &&
    rawSrc.includes('/image/upload/') &&
    !rawSrc.includes('/f_auto')
      ? rawSrc.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_1600,c_limit/')
      : rawSrc;

  return (
    <div className={cn('relative size-full overflow-hidden bg-slate-100', containerClassName)}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200/80 animate-pulse"
        >
          <ImageIcon className="size-8 text-slate-400/50" />
        </div>
      )}

      <Image
        src={finalSrc}
        alt={alt || 'Image'}
        className={cn(
          'transition-all duration-500 ease-out',
          isLoading ? 'opacity-0 scale-95 blur-xs' : 'opacity-100 scale-100 blur-0',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
