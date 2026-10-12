


export interface ApiErrorEnvelope {
  status: 'failed';
  status_code: string;
  error: {
    title: string;
    detail: string;
  };
}

export interface ApiFailure<TField extends string = string> {
  
  title: string;
  
  detail: string;
  
  statusCode: string | null;
  
  field: TField | null;
  
  retryable: boolean;
}


export type ApiResult<TField extends string = string> =
  { ok: true; message?: string } | { ok: false; failure: ApiFailure<TField> | null };


export const CLIENT_ERROR_TITLES = {
  network: 'Network_unavailable',
  timeout: 'Request_timeout',
  malformed: 'Unexpected_response',
  rateLimited: 'Too_many_requests',
  notConfigured: 'Endpoint_not_configured',
} as const;

export const GENERIC_ERROR_DETAIL =
  "We couldn't send that just now. Try again in a moment, or email us directly.";


export type FieldResolver<TField extends string> = (title: string) => TField | null;


export function createFieldResolver<TField extends string>(
  map: Readonly<Record<string, TField>>,
): FieldResolver<TField> {
  const lookup = new Map<string, TField>(
    Object.entries(map).map(([title, field]) => [title.toLowerCase(), field]),
  );
  return (title) => lookup.get(title.trim().toLowerCase()) ?? null;
}

export function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (typeof value !== 'object' || value === null) return false;
  const error = (value as Record<string, unknown>).error;
  if (typeof error !== 'object' || error === null) return false;
  const { title, detail } = error as Record<string, unknown>;
  return typeof title === 'string' && title.length > 0 && typeof detail === 'string';
}
