import { postJson } from '@/lib/api/client';
import { createFieldResolver, type ApiResult } from '@/lib/api/errors';
import { SHEETS_ENABLED, SHEET_TABS, postToSheet } from '@/lib/sheets/submit';
import type { SubmitFn } from '@/hooks/use-form-submission';
import type { QuestionField, QuestionValues } from './schema';



const ENDPOINT = process.env.NEXT_PUBLIC_BASE_ENDPOINT
  ? `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/questions`
  : '';


export const QUESTIONS_FORM_ENABLED =
  SHEETS_ENABLED ||
  (process.env.NEXT_PUBLIC_QUESTIONS_FORM_ENABLED === 'true' && ENDPOINT !== '');

export interface QuestionPayload extends QuestionValues {
  
  request_id: string;
  
  source: string;
  
  company_website: string;
}


export const QUESTION_META_FIELDS = ['company_website'] as const;


const resolveField = createFieldResolver<QuestionField>({
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

  Invalid_question: 'question',
  Question_too_short: 'question',
  Question_too_long: 'question',
  Question_rejected: 'question',
});

export const submitQuestion: SubmitFn<QuestionValues> = (
  values,
  { requestId, signal, meta },
): Promise<ApiResult<QuestionField>> => {
  const payload: QuestionPayload = {
    ...values,
    request_id: requestId,
    source: 'website_faq',
    company_website: meta.company_website ?? '',
  };



  if (SHEETS_ENABLED) {
    return postToSheet<QuestionField>(SHEET_TABS.questions, payload, { signal });
  }

  return postJson<QuestionField>(ENDPOINT, payload, { signal, resolveField });
};
