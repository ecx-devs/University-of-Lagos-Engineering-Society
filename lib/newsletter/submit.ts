import { GENERIC_ERROR_DETAIL, type ApiResult } from '@/lib/api/errors';
import type { SubmitFn } from '@/hooks/use-form-submission';
import { SUBSTACK_URL } from '@/components/constants';
import { SHEETS_ENABLED, SHEET_TABS, postToSheet } from '@/lib/sheets/submit';
import { subscribeToSubstack } from './substack';
import { NEWSLETTER_ERROR_TITLES } from './error-titles';
import type { NewsletterField, NewsletterValues } from './schema';



export const submitNewsletter: SubmitFn<NewsletterValues> = async (
  values,
  { signal, meta },
): Promise<ApiResult<NewsletterField>> => {


  if ((meta.company_website ?? '').trim() !== '') {
    return { ok: true };
  }



  if (SHEETS_ENABLED) {
    return postToSheet<NewsletterField>(SHEET_TABS.newsletter, { ...values }, { signal });
  }

  if (!SUBSTACK_URL) {
    console.error('SUBSTACK_URL is not configured.');
    return {
      ok: false,
      failure: {
        title: NEWSLETTER_ERROR_TITLES.failed,
        detail: GENERIC_ERROR_DETAIL,
        statusCode: null,
        field: null,
        retryable: false,
      },
    };
  }

  return subscribeToSubstack(SUBSTACK_URL, values.email, signal);
};


export const NEWSLETTER_FORM_ENABLED = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ENABLED !== 'false';
export const NEWSLETTER_SUBSTACK_URL = process.env.NEXT_PUBLIC_NEWSLETTER_SUBSTACK_URL;


export const NEWSLETTER_META_FIELDS = ['company_website'] as const;
