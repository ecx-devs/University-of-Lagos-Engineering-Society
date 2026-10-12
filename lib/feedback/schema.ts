import { z } from 'zod';

import { defineForm, type FieldOf, type ValuesOf } from '@/lib/forms/define-form';
import { collapseWhitespace, normalizeEmail, trim } from '@/lib/forms/normalizers';



export const FEEDBACK_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 2, max: 100 },
  message: { min: 10, max: 2000 },
} as const;


const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'\-. ]*$/u;

export const feedbackForm = defineForm({
  name: {
    normalize: collapseWhitespace,
    schema: z
      .string()
      .max(FEEDBACK_LIMITS.name.max, `Keep your name under ${FEEDBACK_LIMITS.name.max} characters.`)
      .regex(/^(?:[\p{L}\p{M}][\p{L}\p{M}'\-. ]*)?$/u, 'Use letters, spaces, hyphens and apostrophes only.'),
  },
  email: {
    normalize: normalizeEmail,
    schema: z
      .string()
      .max(FEEDBACK_LIMITS.email.max, 'That email address is too long.')
      .email('That email address does not look right. Check for a typo.')
      .or(z.literal('')),
  },
  subject: {
    normalize: collapseWhitespace,
    schema: z
      .string()
      .min(FEEDBACK_LIMITS.subject.min, 'Enter a subject — at least 2 characters.')
      .max(
        FEEDBACK_LIMITS.subject.max,
        `Keep your subject under ${FEEDBACK_LIMITS.subject.max} characters.`,
      ),
  },
  message: {
    normalize: trim,
    schema: z
      .string()
      .min(
        FEEDBACK_LIMITS.message.min,
        'Tell us a little more — at least 10 characters.',
      )
      .max(
        FEEDBACK_LIMITS.message.max,
        `Keep your feedback under ${FEEDBACK_LIMITS.message.max.toLocaleString()} characters.`,
      ),
  },
});

export type FeedbackValues = ValuesOf<typeof feedbackForm>;
export type FeedbackField = FieldOf<typeof feedbackForm>;
