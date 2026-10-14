import { type ApiResult } from '@/lib/api/errors';
import type { SubmitFn } from '@/hooks/use-form-submission';
import { SHEETS_ENABLED, SHEET_TABS, postToSheet } from '@/lib/sheets/submit';
import type { NewsletterField, NewsletterValues } from './schema';

export const submitNewsletter: SubmitFn<NewsletterValues> = async (
  values,
  { signal, meta },
): Promise<ApiResult<NewsletterField>> => {
  // Honeypot spam check
  if ((meta.company_website ?? '').trim() !== '') {
    return { ok: true };
  }

  if (SHEETS_ENABLED) {
    return postToSheet<NewsletterField>(SHEET_TABS.newsletter, { ...values }, { signal });
  }

  // Built-in newsletter subscription confirmation
  return { ok: true, message: 'Thanks for subscribing to ULES newsletters!' };
};

export const NEWSLETTER_FORM_ENABLED = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ENABLED !== 'false';
export const NEWSLETTER_META_FIELDS = ['company_website'] as const;
