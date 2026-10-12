import { SITE } from '@/lib/seo';


export function isExternalHref(href: string | undefined | null): boolean {
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('/')) return false;
  if (/^(mailto:|tel:|sms:)/i.test(href)) return false;

  try {
    return new URL(href, SITE.url).origin !== new URL(SITE.url).origin;
  } catch {


    return false;
  }
}


export function externalLinkProps(href: string | undefined | null) {
  return isExternalHref(href)
    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
    : ({} as const);
}
