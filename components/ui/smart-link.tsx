import Link from 'next/link';

import { isExternalHref } from '@/lib/links';



type SmartLinkProps = React.ComponentProps<'a'> & {
  href: string;
};

export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
