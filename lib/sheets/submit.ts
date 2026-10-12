import { fetchWithTimeout } from '@/lib/api/client';
import { CLIENT_ERROR_TITLES, GENERIC_ERROR_DETAIL, type ApiResult } from '@/lib/api/errors';



export const SHEETS_ENDPOINT = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT ?? '';


export const SHEETS_ENABLED = SHEETS_ENDPOINT !== '';


export const SHEET_TABS = {
  contact: 'Contact',
  questions: 'Questions',
  feedback: 'Feedback',
  newsletter: 'Newsletter',
} as const;

export type SheetTab = (typeof SHEET_TABS)[keyof typeof SHEET_TABS];

export async function postToSheet<TField extends string = string>(
  tab: SheetTab,


  payload: object,
  { signal }: { signal?: AbortSignal } = {},
): Promise<ApiResult<TField>> {
  const raw = await fetchWithTimeout(
    SHEETS_ENDPOINT,
    { tab, submittedAt: new Date().toISOString(), ...payload },
    {
      signal,


      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    },
  );

  if (!raw.ok) return { ok: false, failure: raw.failure };



  if (raw.response.ok) return { ok: true };

  return {
    ok: false,
    failure: {
      title: CLIENT_ERROR_TITLES.malformed,
      detail: GENERIC_ERROR_DETAIL,
      statusCode: String(raw.response.status),
      field: null,
      retryable: raw.response.status >= 500,
    },
  };
}
