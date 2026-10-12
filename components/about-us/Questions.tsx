'use client';

import { useId } from 'react';

import {
  CharacterCount,
  FieldMessage,
  FormErrorBanner,
  FormOverlay,
  FormSuccess,
  HoneypotField,
  SubmitButton,
} from '../forms';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

import { useFormSubmission } from '@/hooks/use-form-submission';
import { QUESTION_LIMITS, questionsForm } from '@/lib/questions/schema';
import {
  QUESTION_META_FIELDS,
  QUESTIONS_FORM_ENABLED,
  submitQuestion,
} from '@/lib/questions/submit';



const INPUT_CLASS =
  'h-12.25 rounded-lg border-border px-4 py-3 text-base/6 text-foreground ' +
  'placeholder:text-foreground/50 aria-invalid:border-destructive ' +
  'aria-invalid:ring-destructive/20 disabled:opacity-60 dark:bg-transparent';

export function Questions() {
  const uid = useId();
  const inactive = !QUESTIONS_FORM_ENABLED;

  const {
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
  } = useFormSubmission({
    form: questionsForm,
    submit: submitQuestion,
    idPrefix: uid,
    disabled: inactive,
    metaFields: QUESTION_META_FIELDS,
  });

  const emailHintId = `${uid}-email-hint`;

  return (
    <section className="px-section py-16">
      <h2 className="text-primary text-center text-3xl/9 font-medium">Still Have Questions?</h2>
      <p className="mt-4 text-center text-lg/7 font-normal text-foreground md:mb-8">
        If you couldn&apos;t find the answer you were looking for, send us a message and we&apos;ll
        get back to you.
      </p>

      {succeeded ? (
        <FormSuccess
          title="Your question is with us"
          description={
            <>
              We&apos;ll send the answer to{' '}
              <span className="font-medium text-foreground">{succeeded.values.email}</span>. Check
              your spam folder if you don&apos;t see it.
            </>
          }
          reference={succeeded.reference}
          actionLabel="Ask another question"
          onAction={reset}
        />
      ) : (
        <FormOverlay
          active={inactive}
          label="Coming soon"
          title="This form isn't open yet"
          description="We're still setting it up. In the meantime, reach us on our social channels and we'll get back to you."
        >
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-lg border border-border px-4 py-8 md:px-8"
          >
            <HoneypotField id={`${uid}-company`} />

            <FormErrorBanner
              failure={formError}
              onRetry={retry}
              canRetry={canRetry}
              retryDisabled={isSubmitting}
            />

            <FieldGroup className="gap-y-6">
              <Field className="gap-y-2">
                <FieldLabel htmlFor={`${uid}-name`}>Name</FieldLabel>
                <Input
                  {...fieldProps('name')}
                  autoComplete="name"
                  maxLength={QUESTION_LIMITS.name.max}
                  placeholder="Your name"
                  className={INPUT_CLASS}
                />
                <FieldMessage id={errorId('name')} message={fieldErrors.name} />
              </Field>

              <Field className="gap-y-2">
                <FieldLabel htmlFor={`${uid}-email`}>Email</FieldLabel>
                <Input
                  {...fieldProps('email', { describedBy: emailHintId })}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={QUESTION_LIMITS.email.max}
                  placeholder="your.email@example.com"
                  className={INPUT_CLASS}
                />
                {fieldErrors.email ? (
                  <FieldMessage id={errorId('email')} message={fieldErrors.email} />
                ) : (
                  <p id={emailHintId} className="text-sm/5 text-muted-foreground">
                    This is where we&apos;ll send the answer.
                  </p>
                )}
              </Field>

              <Field className="gap-y-2">
                <FieldLabel htmlFor={`${uid}-question`}>Your Question</FieldLabel>
                <Textarea
                  {...fieldProps('question')}
                  maxLength={QUESTION_LIMITS.question.max}
                  placeholder="Type your question here..."
                  className={`${INPUT_CLASS} h-36.25`}
                />
                <div className="flex items-start justify-between gap-4">
                  <FieldMessage id={errorId('question')} message={fieldErrors.question} />
                  <CharacterCount
                    value={lengths.question ?? 0}
                    max={QUESTION_LIMITS.question.max}
                  />
                </div>
              </Field>

              <SubmitButton pending={isSubmitting} pendingLabel="Sending">
                Send
              </SubmitButton>
            </FieldGroup>
          </form>
        </FormOverlay>
      )}
    </section>
  );
}
