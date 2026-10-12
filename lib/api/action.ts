import { CLIENT_ERROR_TITLES, type ApiResult } from './errors';



const DEFAULT_TIMEOUT_MS = 15_000;

export interface CallActionOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

const TIMED_OUT = Symbol('timed-out');

export async function callAction<TField extends string = string>(
  run: () => Promise<ApiResult<TField>>,
  { signal, timeoutMs = DEFAULT_TIMEOUT_MS }: CallActionOptions = {},
): Promise<ApiResult<TField>> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const result = await Promise.race([
      run(),
      new Promise<typeof TIMED_OUT>((resolve) => {
        timer = setTimeout(() => resolve(TIMED_OUT), timeoutMs);
      }),
    ]);

    if (signal?.aborted) return { ok: false, failure: null };

    if (result === TIMED_OUT) {
      return {
        ok: false,
        failure: {
          title: CLIENT_ERROR_TITLES.timeout,
          detail: 'That took longer than expected. It may not have gone through — try again.',
          statusCode: null,
          field: null,
          retryable: true,
        },
      };
    }

    return result;
  } catch (error) {
    if (signal?.aborted) return { ok: false, failure: null };

    console.error('Server action failed', error);
    return {
      ok: false,
      failure: {
        title: CLIENT_ERROR_TITLES.network,
        detail: "We couldn't reach the server. Check your connection and try again.",
        statusCode: null,
        field: null,
        retryable: true,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}
