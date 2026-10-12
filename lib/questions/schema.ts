import { z } from 'zod';

import { defineForm, type FieldOf, type ValuesOf } from '@/lib/forms/define-form';
import { collapseWhitespace, normalizeEmail, trim } from '@/lib/forms/normalizers';

export const QUESTION_LIMITS = {
  name: {
    min: 2,
    max: 80,
  },
  email: {
    max: 254,
  },
  question: {
    min: 15,
    max: 2000,
  },
} as const;

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'\-. ]*$/u;

export const questionsForm = defineForm({
  name: {
    normalize: collapseWhitespace,
    schema: z
      .string()
      .min(QUESTION_LIMITS.name.min, 'Enter your name — at least 2 characters.')
      .max(QUESTION_LIMITS.name.max, `Keep your name under ${QUESTION_LIMITS.name.max} characters.`)
      .regex(NAME_PATTERN, 'Use letters, spaces, hyphens and apostrophes only.'),
  },
  email: {
    normalize: normalizeEmail,
    schema: z
      .string()
      .min(1, 'Enter the email address you want the answer sent to.')
      .max(QUESTION_LIMITS.email.max, 'That email address is too long.')
      .email('That email address does not look right. Check for a typo.'),
  },
  question: {
    normalize: trim,
    schema: z
      .string()
      .min(
        QUESTION_LIMITS.question.min,
        'Add a bit more detail so we can answer properly — at least 15 characters.',
      )
      .max(
        QUESTION_LIMITS.question.max,
        `Keep your question under ${QUESTION_LIMITS.question.max.toLocaleString()} characters.`,
      ),
  },
});

export type QuestionValues = ValuesOf<typeof questionsForm>;
export type QuestionField = FieldOf<typeof questionsForm>;
