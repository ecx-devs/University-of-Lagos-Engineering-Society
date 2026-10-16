import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/optimized-image';

type AlbumCardProps = {
  slug: string;
  title: string;
  coverImage: string;
  coverAlt: string;
  photoCount: number;
};

export function AlbumCard({ slug, title, coverImage, coverAlt, photoCount }: AlbumCardProps) {
  return (
    <Link
      href={`/activities/gallery/${slug}`}
      className="group hover-lift focus-visible:ring-ring/50 relative block aspect-square overflow-hidden rounded-2xl outline-none focus-visible:ring-3 bg-slate-900/10"
    >
      <OptimizedImage
        src={coverImage}
        alt={coverAlt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        aria-hidden="true"
        className="from-primary/80 via-primary/25 absolute inset-0 bg-linear-to-t to-transparent to-70%"
      />

      <div className="absolute inset-x-0 bottom-0 p-8">
        <h3 className="text-xl/7 font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm/5 text-primary-foreground">
          {photoCount === 0
            ? 'Photos coming soon'
            : `${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}`}
        </p>
      </div>
    </Link>
  );
}
