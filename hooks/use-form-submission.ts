'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { newRequestId } from '@/lib/api/client';
import type { ApiFailure, ApiResult } from '@/lib/api/errors';
import type { FormDefinition } from '@/lib/forms/define-form';
import type { FieldErrors, FieldName, FormValues } from '@/lib/forms/types';



export interface SubmitContext {
  
  requestId: string;
  signal: AbortSignal;
  
  meta: Record<string, string>;
}

export type SubmitFn<TValues extends FormValues> = (
  values: TValues,
  context: SubmitContext,
) => Promise<ApiResult<FieldName<TValues>>>;

export interface FormSubmissionSuccess<TValues extends FormValues> {
  values: TValues;
  
  reference: string;
  
  message?: string;
}

export interface UseFormSubmissionOptions<TValues extends FormValues> {
  form: FormDefinition<TValues>;
  submit: SubmitFn<TValues>;
  
  idPrefix: string;
  
  disabled?: boolean;
  
  metaFields?: readonly string[];
}

export interface FieldPropsOptions {
  
  describedBy?: string;
}

export interface FieldProps {
  id: string;
  name: string;
  disabled: boolean;
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
  onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface UseFormSubmissionResult<TValues extends FormValues> {
  formRef: React.RefObject<HTMLFormElement | null>;
  fieldErrors: FieldErrors<TValues>;
  
  formError: ApiFailure<FieldName<TValues>> | null;
  isSubmitting: boolean;
  succeeded: FormSubmissionSuccess<TValues> | null;
  
  lengths: Partial<Record<FieldName<TValues>, number>>;
  
  canRetry: boolean;
  handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  retry: () => void;
  reset: () => void;
  fieldProps: (field: FieldName<TValues>, options?: FieldPropsOptions) => FieldProps;
  errorId: (field: FieldName<TValues>) => string;
}

interface Attempt<TValues> {
  values: TValues;
  requestId: string;
  meta: Record<string, string>;
}


const NO_META_FIELDS: readonly string[] = [];

export function useFormSubmission<TValues extends FormValues>({
  form,
  submit,
  idPrefix,
  disabled = false,
  metaFields = NO_META_FIELDS,
}: UseFormSubmissionOptions<TValues>): UseFormSubmissionResult<TValues> {
  type TField = FieldName<TValues>;

  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  
  const lastAttemptRef = useRef<Attempt<TValues> | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TValues>>({});
  const [formError, setFormError] = useState<ApiFailure<TField> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState<FormSubmissionSuccess<TValues> | null>(null);
  const [lengths, setLengths] = useState<Partial<Record<TField, number>>>({});
  const [canRetry, setCanRetry] = useState(false);


  useEffect(() => () => abortRef.current?.abort(), []);

  const errorId = useCallback((field: TField) => `${idPrefix}-${field}-error`, [idPrefix]);

  const focusField = useCallback((field: TField) => {
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  }, []);

  const send = useCallback(
    async (attempt: Attempt<TValues>) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSubmitting(true);
      setFormError(null);
      setCanRetry(false);

      const result = await submit(attempt.values, {
        requestId: attempt.requestId,
        signal: controller.signal,
        meta: attempt.meta,
      });

      if (controller.signal.aborted) return;
      setIsSubmitting(false);

      if (result.ok) {
        lastAttemptRef.current = null;
        setSucceeded({
          values: attempt.values,
          reference: attempt.requestId,
          message: result.message,
        });
        return;
      }
      if (!result.failure) return;

      lastAttemptRef.current = attempt;
      setCanRetry(result.failure.retryable);



      if (result.failure.field) {
        setFieldErrors({ [result.failure.field]: result.failure.detail } as FieldErrors<TValues>);
        focusField(result.failure.field);
      } else {
        setFormError(result.failure);
      }
    },
    [submit, focusField],
  );

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting || disabled) return;

      const formData = new FormData(event.currentTarget);

      const raw: Record<string, unknown> = {};
      for (const field of form.fields) raw[field] = formData.get(field);

      const parsed = form.parse(raw);
      if (!parsed.ok) {
        setFieldErrors(parsed.errors);
        setFormError(null);
        setCanRetry(false);
        const first = form.fields.find((field) => parsed.errors[field]);
        if (first) focusField(first);
        return;
      }

      const meta: Record<string, string> = {};
      for (const name of metaFields) meta[name] = String(formData.get(name) ?? '');

      setFieldErrors({});
      void send({ values: parsed.values, requestId: newRequestId(), meta });
    },
    [disabled, focusField, form, isSubmitting, metaFields, send],
  );

  const retry = useCallback(() => {
    const attempt = lastAttemptRef.current;
    if (attempt && !isSubmitting) void send(attempt);
  }, [isSubmitting, send]);

  const reset = useCallback(() => {
    formRef.current?.reset();
    lastAttemptRef.current = null;
    setFieldErrors({});
    setFormError(null);
    setLengths({});
    setSucceeded(null);
    setCanRetry(false);
  }, []);

  const fieldProps = useCallback(
    (field: TField, options: FieldPropsOptions = {}): FieldProps => {
      const hasError = Boolean(fieldErrors[field]);
      return {
        id: `${idPrefix}-${field}`,
        name: field,
        disabled: isSubmitting || disabled,
        'aria-invalid': hasError,
        'aria-describedby': hasError ? errorId(field) : options.describedBy,
        onBlur: (event) => {


          const value = event.target.value;

          if (value.trim() === '') return;
          setFieldErrors((previous) => ({
            ...previous,
            [field]: form.validateField(field, value),
          }));
        },
        onChange: (event) => {


          const value = event.target.value;
          setLengths((previous) => ({ ...previous, [field]: value.length }));


          setFieldErrors((previous) =>
            previous[field] ? { ...previous, [field]: undefined } : previous,
          );

          setFormError(null);
          setCanRetry(false);
          lastAttemptRef.current = null;
        },
      };
    },
    [disabled, errorId, fieldErrors, form, idPrefix, isSubmitting],
  );

  return {
    formRef,
    fieldErrors,
    formError,
    isSubmitting,
    succeeded,
    lengths,
    canRetry,
    handleSubmit,
    retry,
    reset,
    fieldProps,
    errorId,
  };
}
