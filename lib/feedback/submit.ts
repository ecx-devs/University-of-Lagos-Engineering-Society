import { createFieldResolver, type ApiResult } from '@/lib/api/errors';
import type { SubmitFn } from '@/hooks/use-form-submission';
import type { FeedbackField, FeedbackValues } from './schema';
import { submitFeedbackAction } from '@/app/actions/feedback';

export const FEEDBACK_FORM_ENABLED = true;

export interface FeedbackPayload extends FeedbackValues {
  request_id: string;
  source: string;
  company_website: string;
}

export const FEEDBACK_META_FIELDS = ['company_website'] as const;

const resolveField = createFieldResolver<FeedbackField>({
  Invalid_name: 'name',
  Name_mismatch: 'name',
  Name_too_short: 'name',
  Name_too_long: 'name',

  Invalid_email: 'email',
  Email_too_short: 'email',
  Email_too_long: 'email',

  Invalid_subject: 'subject',
  Subject_mismatch: 'subject',
  Subject_too_short: 'subject',
  Subject_too_long: 'subject',

  Invalid_message: 'message',
  Message_too_short: 'message',
  Message_too_long: 'message',
  Message_rejected: 'message',
});

export const submitFeedback: SubmitFn<FeedbackValues> = async (
  values,
  { requestId, meta },
): Promise<ApiResult<FeedbackField>> => {
  const payload = {
    ...values,
    request_id: requestId,
    source: 'website_feedback',
    company_website: meta.company_website ?? '',
  };

  return await submitFeedbackAction(payload) as ApiResult<FeedbackField>;
};
