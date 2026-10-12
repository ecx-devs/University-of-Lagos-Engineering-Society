import { z } from 'zod';
import type { FieldErrors, FieldName, FormValues } from './types';




export type FieldSchema = z.ZodType<string, string>;

export interface FieldConfig {
  schema: FieldSchema;
  
  normalize?: (raw: string) => string;
}

export type ParseResult<TValues extends FormValues> =
  | { ok: true; values: TValues }
  | { ok: false; errors: FieldErrors<TValues> };

export interface FormDefinition<TValues extends FormValues> {
  
  readonly fields: readonly FieldName<TValues>[];
  readonly schema: z.ZodType<TValues>;
  
  normalize(raw: Record<string, unknown>): TValues;
  
  parse(raw: Record<string, unknown>): ParseResult<TValues>;
  
  validateField(field: FieldName<TValues>, value: string): string | undefined;
  
  errorsFrom(error: z.ZodError): FieldErrors<TValues>;
}

const identity = (value: string): string => value;

export function defineForm<TConfig extends Record<string, FieldConfig>>(
  config: TConfig,
): FormDefinition<{ [K in keyof TConfig]: string }> {
  type TValues = { [K in keyof TConfig]: string };
  type TField = FieldName<TValues>;

  const fields = Object.keys(config) as TField[];

  const shape: Record<string, FieldSchema> = {};
  for (const field of fields) shape[field] = config[field]!.schema;



  const schema = z.object(shape) as unknown as z.ZodType<TValues>;

  function normalizeValue(field: TField, raw: unknown): string {
    const value = typeof raw === 'string' ? raw : '';
    return (config[field]!.normalize ?? identity)(value);
  }

  function normalize(raw: Record<string, unknown>): TValues {
    const out = {} as TValues;
    for (const field of fields) out[field] = normalizeValue(field, raw[field]);
    return out;
  }

  function isField(value: string): value is TField {
    return (fields as readonly string[]).includes(value);
  }

  
  function errorsFrom(error: z.ZodError): FieldErrors<TValues> {


    const out: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && isField(key) && !(key in out)) {
        out[key] = issue.message;
      }
    }
    return out as FieldErrors<TValues>;
  }

  return {
    fields,
    schema,
    normalize,
    errorsFrom,
    parse(raw) {
      const values = normalize(raw);
      const result = schema.safeParse(values);
      return result.success
        ? { ok: true, values }
        : { ok: false, errors: errorsFrom(result.error) };
    },
    validateField(field, value) {
      const result = config[field]!.schema.safeParse(normalizeValue(field, value));
      return result.success ? undefined : result.error.issues[0]?.message;
    },
  };
}


export type ValuesOf<TForm> = TForm extends FormDefinition<infer TValues> ? TValues : never;


export type FieldOf<TForm> = TForm extends FormDefinition<infer TValues>
  ? FieldName<TValues>
  : never;
