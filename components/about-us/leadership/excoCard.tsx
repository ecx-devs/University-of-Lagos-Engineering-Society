import { Card } from '../../ui/card';
import { MessageIcon, PhoneIcon } from '@/components/icons';
import { OptimizedImage } from '@/components/ui/optimized-image';

export type ExcoCardProps = {
  name: string;
  title: string;
  imageSrc?: string;
  imageUrl?: string;
  department: string;
  phoneNumber: string;
  email: string;
};

export function ExcoCard({
  imageSrc,
  imageUrl,
  name,
  title,
  department,
  phoneNumber,
  email,
}: ExcoCardProps) {
  const finalImage = imageUrl || imageSrc || '/logo/logo-transparent.png';

  return (
    <Card className="group flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-0 transition-all duration-300 hover:border-primary/40 hover:shadow-md">
      <div className="relative aspect-4/5 h-56 w-full shrink-0 overflow-hidden bg-slate-100">
        <OptimizedImage
          src={finalImage}
          alt={`${name} - ${title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          fallbackSrc="/logo/logo-transparent.png"
        />
      </div>
      <div className="flex flex-1 w-full flex-col justify-between p-4.5 pr-3 pt-0">
        <div>
          <h3
            className="text-left font-['Neue_Machina'] text-lg/6 font-semibold text-primary transition-colors group-hover:text-primary truncate"
            title={name}
          >
            {name}
          </h3>
          <p
            className="mt-1 text-left text-sm/5 font-medium text-accent truncate"
            title={title}
          >
            {title}
          </p>
          <p
            className="mt-2 text-left text-xs/4 text-muted-foreground truncate"
            title={department}
          >
            {department}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-y-2 border-t border-border/60 pt-3">
          {phoneNumber && (
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              className="group/link flex items-center text-left text-xs/4 text-foreground/80 transition-colors hover:text-primary"
              aria-label={`Call ${name} at ${phoneNumber}`}
              title={phoneNumber}
            >
              <PhoneIcon className="mr-1.5 inline size-3.5 shrink-0 [&_path]:stroke-gray-600 group-hover/link:[&_path]:stroke-primary" />
              <span className="truncate">{phoneNumber}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="group/link flex items-center text-left text-xs/4 text-foreground/80 transition-colors hover:text-primary"
              aria-label={`Email ${name} at ${email}`}
              title={email}
            >
              <MessageIcon className="mr-1.5 inline size-3.5 shrink-0 [&_path]:stroke-gray-600 group-hover/link:[&_path]:stroke-primary" />
              <span className="truncate">{email}</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

