import Image from 'next/image';
import { Card } from '../../ui/card';
import { MessageIcon, PhoneIcon } from '@/components/icons';

type excoCardProps = {
  name: string;
  title: string;
  imageSrc: string;
  department: string;
  phoneNumber: string;
  email: string;
};

export function ExcoCard({ imageSrc, name, title, department, phoneNumber, email }: excoCardProps) {
  return (
    <Card className="flex flex-col items-center gap-y-3 rounded-lg border border-border p-0">
      <div className="relative aspect-4/5 h-52.25 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top"
          loading="eager"
        />
      </div>
      <div className="w-full p-4 pr-3">
        <h3 className="text-primary text-left text-lg/7 font-medium">{name}</h3>
        <p className="text-accent mt-1 text-left text-sm/5">{title}</p>
        <p className="mt-2 text-left text-xs/4 text-foreground">{department}</p>
        <p className="mt-3 text-left text-xs/4 text-foreground">
          <PhoneIcon className="mr-1 inline size-3.5 [&_path]:stroke-gray-700" />
          <span>{phoneNumber}</span>
        </p>
        <p className="mt-2 flex gap-x-1 text-left text-xs/4 text-foreground">
          <MessageIcon className="size-3.5 [&_path]:stroke-gray-700" />
          <span>{email}</span>
        </p>
      </div>
    </Card>
  );
}
