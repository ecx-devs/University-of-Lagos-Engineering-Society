
export const NEWSLETTER_ERROR_TITLES = {
  invalidEmail: 'Invalid_email',
  alreadySubscribed: 'Already_subscribed',
  providerUnavailable: 'Provider_unavailable',
  rateLimited: 'Too_many_requests',
  failed: 'Subscription_failed',
} as const;

export type NewsletterErrorTitle =
  (typeof NEWSLETTER_ERROR_TITLES)[keyof typeof NEWSLETTER_ERROR_TITLES];
