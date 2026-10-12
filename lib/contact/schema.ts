import { z } from 'zod';

import { defineForm, type FieldOf, type ValuesOf } from '@/lib/forms/define-form';
import { collapseWhitespace, normalizeEmail, trim } from '@/lib/forms/normalizers';

export const CONTACT_LIMITS = {
  name: {
    min: 2,
    max: 80,
  },
  email: {
    max: 254,
  },
  subject: {
    min: 2,
    max: 100,
  },
  question: {
    min: 15,
    max: 2000,
  },
} as const;

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'\-. ]*$/u;

export const contactForm = defineForm({
  name: {
    normalize: collapseWhitespace,
    schema: z
      .string()
      .min(CONTACT_LIMITS.name.min, 'Enter your name — at least 2 characters.')
      .max(CONTACT_LIMITS.name.max, `Keep your name under ${CONTACT_LIMITS.name.max} characters.`)
      .regex(NAME_PATTERN, 'Use letters, spaces, hyphens and apostrophes only.'),
  },
  email: {
    normalize: normalizeEmail,
    schema: z
      .string()
      .min(1, 'Enter the email address you want the answer sent to.')
      .max(CONTACT_LIMITS.email.max, 'That email address is too long.')
      .email('That email address does not look right. Check for a typo.'),
  },
  subject: {
    normalize: collapseWhitespace,
    schema: z
      .string()
      .min(CONTACT_LIMITS.subject.min, 'Enter a subject — at least 2 characters.')
      .max(
        CONTACT_LIMITS.subject.max,
        `Keep your subject under ${CONTACT_LIMITS.subject.max} characters.`,
      ),
  },
  question: {
    normalize: trim,
    schema: z
      .string()
      .min(
        CONTACT_LIMITS.question.min,
        'Add a bit more detail so we can answer properly — at least 15 characters.',
      )
      .max(
        CONTACT_LIMITS.question.max,
        `Keep your question under ${CONTACT_LIMITS.question.max.toLocaleString()} characters.`,
      ),
  },
});

export type ContactValues = ValuesOf<typeof contactForm>;
export type ContactField = FieldOf<typeof contactForm>;
