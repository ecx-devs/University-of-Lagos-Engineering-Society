import { fetchWithTimeout } from '@/lib/api/client';
import type { ApiResult } from '@/lib/api/errors';
import { NEWSLETTER_ERROR_TITLES } from './error-titles';
import type { NewsletterField } from './schema';



const FREE_SUBSCRIBE_PATH = '/api/v1/free';

const GENERIC_FAILURE_DETAIL = "Couldn't subscribe right now — please try again.";

async function bodySnippet(response: Response): Promise<string> {
  try {
    return (await response.text()).slice(0, 500);
  } catch {
    return '<unreadable body>';
  }
}

async function interpretSubstackResponse(response: Response): Promise<ApiResult<NewsletterField>> {
  if (response.status === 429) {
    return {
      ok: false,
      failure: {
        title: NEWSLETTER_ERROR_TITLES.rateLimited,
        detail: "You've tried a few times — give it a minute and try again.",
        statusCode: '429',
        field: null,
        retryable: false,
      },
    };
  }

  if (response.ok) {


    return { ok: true, message: 'Thanks for signing up! Check your inbox to confirm.' };
  }



  console.error('Substack rejected the request', response.status, await bodySnippet(response));

  if (response.status === 400 || response.status === 422) {
    return {
      ok: false,
      failure: {
        title: NEWSLETTER_ERROR_TITLES.invalidEmail,
        detail: 'That email address does not look right to Substack. Check for a typo.',
        statusCode: String(response.status),
        field: 'email',
        retryable: false,
      },
    };
  }



  return {
    ok: false,
    failure: {
      title: NEWSLETTER_ERROR_TITLES.providerUnavailable,
      detail: GENERIC_FAILURE_DETAIL,
      statusCode: String(response.status),
      field: null,
      retryable: true,
    },
  };
}

export async function subscribeToSubstack(
  substackUrl: string,
  email: string,
  signal?: AbortSignal,
): Promise<ApiResult<NewsletterField>> {


  const raw = await fetchWithTimeout(`${substackUrl}${FREE_SUBSCRIBE_PATH}`, { email }, { signal });

  if (!raw.ok) return { ok: false, failure: raw.failure };
  return interpretSubstackResponse(raw.response);
}
