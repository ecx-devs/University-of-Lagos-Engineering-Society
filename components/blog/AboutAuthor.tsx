import Image from 'next/image';
import { User } from 'lucide-react';

type AboutAuthorProps = {
  name: string;
  bio?: string;
  pfp?: string | null;
};

export function AboutAuthor({ name, bio, pfp }: AboutAuthorProps) {
  const displayBio =
    bio ||
    'ULES Editorial is the official voice and creative hub of the University of Lagos Engineering Society.';

  return (
    <section className="mt-12 flex flex-col sm:flex-row items-start gap-5 rounded-2xl bg-muted/70 border border-slate-200/70 p-6 sm:p-8">
      {pfp ? (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
          <Image width={64} height={64} src={pfp} alt={name} className="size-full object-contain" />
        </div>
      ) : (
        <span
          aria-hidden="true"
          className="bg-[#170A51] flex size-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-2xs"
        >
          <User className="size-8" />
        </span>
      )}

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C85B15]">About The Author</span>
        </div>
        <h2 className="text-[#170A51] text-xl font-bold mt-0.5">{name}</h2>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">{displayBio}</p>
      </div>
    </section>
  );
}

export default AboutAuthor;
