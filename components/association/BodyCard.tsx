import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';

type BodyCardProps = {
  id?: number;
  slug?: string;
  name: string;
  acronym?: string;
  imageSrc: string;
  imageWidth: number | null;
  imageHeight: number | null;
  tagline: string;
  body: string;
  type: string;
};

export function BodyCard({
  slug,
  name,
  acronym,
  imageSrc,
  imageWidth,
  imageHeight,
  tagline,
  body,
  type,
}: BodyCardProps) {
  const targetSlug =
    slug ??
    name
      .toLowerCase()
      .replace(/unilag/gi, '')
      .replace(/[^a-z0-9]+/g, '')
      .trim();

  const href = `/associations/${targetSlug}`;
  const displayLabel = acronym ? `${acronym} | ULES` : name;
  const fullLabel = acronym ? `${name} (${acronym})` : name;

  return (
    <Card
      id={targetSlug}
      className="hover-lift flex h-full flex-col items-center gap-y-3 rounded-lg border border-border p-0 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <Link
        href={href}
        className="flex h-55 w-full items-center justify-center overflow-hidden px-6 py-4 transition-transform hover:scale-105"
        aria-label={`View ${displayLabel} - ${tagline} official profile`}
        title={`${fullLabel} - ${tagline}`}
      >
        <Image
          src={imageSrc}
          alt={`${fullLabel} Logo`}
          width={imageWidth ?? 200}
          height={imageHeight ?? 200}
          className={`object-contain ${type === 'departmental' ? 'h-50 w-auto' : 'h-fit'}`}
          loading="eager"
        />
      </Link>

      <div className="flex w-full flex-1 flex-col justify-between p-6 pr-4">
        <div>
          <Link href={href} className="group/title block" title={`Official profile of ${displayLabel} – ${name}`}>
            <h3 className="text-primary group-hover/title:text-accent text-left text-2xl/6 font-medium transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-accent mt-3 mb-4 truncate text-left text-sm/5">{tagline}</p>
          <p className="line-clamp-5 pr-1.5 text-left text-base/6 whitespace-pre-line text-foreground">
            {body}
          </p>
        </div>

        <div className="pt-4">
          <Link
            href={href}
            className="text-primary hover:text-accent group/btn inline-flex items-center gap-1.5 text-sm/5 font-semibold transition-colors"
            title={`View official details and leadership for ${displayLabel}`}
          >
            <span>Read more</span>
            <ArrowRight
              className="size-4 transition-transform group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
            <span className="sr-only">about {displayLabel} – {tagline}</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
