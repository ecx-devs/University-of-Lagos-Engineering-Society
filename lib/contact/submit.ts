import { postJson } from '@/lib/api/client';
import { createFieldResolver, type ApiResult } from '@/lib/api/errors';
import { SHEETS_ENABLED, SHEET_TABS, postToSheet } from '@/lib/sheets/submit';
import type { SubmitFn } from '@/hooks/use-form-submission';
import type { ContactField, ContactValues } from './schema';



const ENDPOINT = process.env.NEXT_PUBLIC_BASE_ENDPOINT
  ? `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/contact`
  : '';


export const CONTACT_FORM_ENABLED =
  SHEETS_ENABLED ||
  (process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED === 'true' && ENDPOINT !== '');

export interface ContactPayload extends ContactValues {
  
  request_id: string;
  
  source: string;
  
  company_website: string;
}


export const CONTACT_META_FIELDS = ['company_website'] as const;


const resolveField = createFieldResolver<ContactField>({
  Name_mismatch: 'name',
  Invalid_name: 'name',
  Name_too_short: 'name',
  Name_too_long: 'name',

  Invalid_email: 'email',
  Email_invalid: 'email',
  Email_rejected: 'email',
  Email_undeliverable: 'email',
  Email_blocked: 'email',
  Disposable_email: 'email',
  Duplicate_submission: 'email',

  Subject_mismatch: 'subject',
  Invalid_subject: 'subject',
  Subject_too_short: 'subject',
  Subject_too_long: 'subject',

  Invalid_question: 'question',
  Question_too_short: 'question',
  Question_too_long: 'question',
  Question_rejected: 'question',
});

export const submitContact: SubmitFn<ContactValues> = (
  values,
  { requestId, signal, meta },
): Promise<ApiResult<ContactField>> => {
  const payload: ContactPayload = {
    ...values,
    request_id: requestId,
    source: 'website_faq',
    company_website: meta.company_website ?? '',
  };



  if (SHEETS_ENABLED) {
    return postToSheet<ContactField>(SHEET_TABS.contact, payload, { signal });
  }

  return postJson<ContactField>(ENDPOINT, payload, { signal, resolveField });
};
