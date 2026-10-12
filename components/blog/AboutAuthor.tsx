import Image from 'next/image';
import { User } from 'lucide-react';



type AboutAuthorProps = {
  name: string;
  bio: string;
  pfp: string | null;
};

export function AboutAuthor({ name, bio, pfp }: AboutAuthorProps) {
  return (
    <section className="mt-10 flex items-start gap-4 rounded-lg bg-muted p-6">
      {
        pfp ? <Image width={64} height={64} loading="eager" src={pfp} alt={name} className="size-16 rounded" /> : <span
        aria-hidden="true"
        className="bg-accent flex size-16 shrink-0 items-center justify-center rounded-full text-white"
      >
        <User className="size-8" />
      </span>
      }

      <div className="min-w-0">
        <h2 className="text-primary text-xl/7 font-medium">About {name}</h2>
        <p className="mt-2 text-base/6 text-foreground">{bio}</p>
      </div>
    </section>
  );
}
