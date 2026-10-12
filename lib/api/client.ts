import {
  CLIENT_ERROR_TITLES,
  GENERIC_ERROR_DETAIL,
  isApiErrorEnvelope,
  type ApiErrorEnvelope,
  type ApiFailure,
  type ApiResult,
  type FieldResolver,
} from './errors';

const DEFAULT_TIMEOUT_MS = 15_000;



export interface FetchOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
  
  credentials?: RequestCredentials;
  
  headers?: HeadersInit;
}


export type TransportFailure = Omit<ApiFailure, 'field'> & { field: null };

export type RawFetchResult =
  { ok: true; response: Response } | { ok: false; failure: TransportFailure | null };

export async function fetchWithTimeout(
  url: string,
  body: unknown,
  {
    signal: externalSignal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    credentials = 'omit',
    headers: extraHeaders,
  }: FetchOptions = {},
): Promise<RawFetchResult> {
  if (!url) {
    console.error('fetchWithTimeout called with no endpoint URL.');
    return {
      ok: false,
      failure: {
        title: CLIENT_ERROR_TITLES.notConfigured,
        detail: GENERIC_ERROR_DETAIL,
        statusCode: null,
        field: null,
        retryable: false,
      },
    };
  }

  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = externalSignal ? AbortSignal.any([timeout, externalSignal]) : timeout;



  const headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' });
  if (extraHeaders) {
    for (const [key, value] of new Headers(extraHeaders)) headers.set(key, value);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal,
      credentials,
      cache: 'no-store',
    });
    return { ok: true, response };
  } catch (error) {
    if (externalSignal?.aborted) return { ok: false, failure: null };

    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    return {
      ok: false,
      failure: {
        title: timedOut ? CLIENT_ERROR_TITLES.timeout : CLIENT_ERROR_TITLES.network,
        detail: timedOut
          ? 'That took longer than expected. It may not have gone through — try again.'
          :


            "We couldn't reach the server. Check your connection and try again.",
        statusCode: null,
        field: null,
        retryable: true,
      },
    };
  }
}





export interface PostJsonOptions<TField extends string> extends FetchOptions {
  resolveField?: FieldResolver<TField>;
}


async function readErrorEnvelope(response: Response): Promise<ApiErrorEnvelope | null> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('json')) return null;
  try {
    const body: unknown = await response.json();
    return isApiErrorEnvelope(body) ? body : null;
  } catch {
    return null;
  }
}


function failureForBareStatus<TField extends string>(status: number): ApiResult<TField> {
  if (status === 429) {
    return {
      ok: false,
      failure: {
        title: CLIENT_ERROR_TITLES.rateLimited,
        detail: "You've sent a few of these already. Give it a few minutes and try again.",
        statusCode: String(status),
        field: null,
        retryable: false,
      },
    };
  }
  return {
    ok: false,
    failure: {
      title: CLIENT_ERROR_TITLES.malformed,
      detail: GENERIC_ERROR_DETAIL,
      statusCode: String(status),
      field: null,
      retryable: status >= 500,
    },
  };
}

export async function postJson<TField extends string = string>(
  url: string,
  body: unknown,
  options: PostJsonOptions<TField> = {},
): Promise<ApiResult<TField>> {
  const { resolveField, ...fetchOptions } = options;

  const raw = await fetchWithTimeout(url, body, fetchOptions);
  if (!raw.ok) return { ok: false, failure: raw.failure };

  const { response } = raw;



  if (response.ok) return { ok: true };

  const envelope = await readErrorEnvelope(response);
  if (!envelope) return failureForBareStatus<TField>(response.status);

  return {
    ok: false,
    failure: {
      title: envelope.error.title,
      detail: envelope.error.detail.trim() || GENERIC_ERROR_DETAIL,
      statusCode: String(envelope.status_code ?? response.status),
      field: resolveField?.(envelope.error.title) ?? null,


      retryable: response.status >= 500,
    },
  };
}


export function newRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
