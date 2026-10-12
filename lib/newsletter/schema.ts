import { z } from 'zod';

import { defineForm, type FieldOf, type ValuesOf } from '@/lib/forms/define-form';
import { normalizeEmail } from '@/lib/forms/normalizers';



export const NEWSLETTER_LIMITS = {
  email: { max: 254 },
} as const;


export const newsletterForm = defineForm({
  email: {
    normalize: normalizeEmail,
    schema: z
      .string()
      .min(1, 'Enter the email address you want the answer sent to.')
      .max(NEWSLETTER_LIMITS.email.max, 'That email address is too long.')
      .email('That email address does not look right. Check for a typo.'),
  },
});

export type NewsletterValues = ValuesOf<typeof newsletterForm>;
export type NewsletterField = FieldOf<typeof newsletterForm>;
