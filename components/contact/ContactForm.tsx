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
import { CONTACT_LIMITS, contactForm } from '@/lib/contact/schema';
import { CONTACT_META_FIELDS, CONTACT_FORM_ENABLED, submitContact } from '@/lib/contact/submit';



const INPUT_CLASS =
  'h-12.25 rounded-lg border-border px-4 py-3 text-base/6 text-foreground ' +
  'placeholder:text-foreground/50 aria-invalid:border-destructive ' +
  'aria-invalid:ring-destructive/20 disabled:opacity-60 dark:bg-transparent';

export function ContactForm() {
  const uid = useId();
  const inactive = !CONTACT_FORM_ENABLED;

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
    form: contactForm,
    submit: submitContact,
    idPrefix: uid,
    disabled: inactive,
    metaFields: CONTACT_META_FIELDS,
  });

  const emailHintId = `${uid}-email-hint`;

  return (
    <section className="xs:px-[4.1%] px-4 py-16 pb-12 lg:px-[5.7855%] xl:px-[10%]">
      <h2 className="text-primary mb-6 text-left text-3xl/9 font-medium">Send Us a Message</h2>

      {succeeded ? (
        <FormSuccess
          title="Your message is with us"
          description={
            <>
              We&apos;ll get back to you at{' '}
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
          <form ref={formRef} noValidate onSubmit={handleSubmit} className="relative">
            <HoneypotField id={`${uid}-company`} />

            <FormErrorBanner
              failure={formError}
              onRetry={retry}
              canRetry={canRetry}
              retryDisabled={isSubmitting}
            />

            <FieldGroup className="gap-y-6 p-0">
              <Field className="gap-y-2">
                <FieldLabel htmlFor={`${uid}-name`}>Name</FieldLabel>
                <Input
                  {...fieldProps('name')}
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name.max}
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
                  maxLength={CONTACT_LIMITS.email.max}
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
                <FieldLabel htmlFor={`${uid}-subject`}>Subject</FieldLabel>
                <Input
                  {...fieldProps('subject')}
                  autoComplete="subject"
                  maxLength={CONTACT_LIMITS.subject.max}
                  placeholder="What is this regarding?"
                  className={INPUT_CLASS}
                />
                <FieldMessage id={errorId('subject')} message={fieldErrors.subject} />
              </Field>

              <Field className="gap-y-2">
                <FieldLabel htmlFor={`${uid}-question`}>Your Question</FieldLabel>
                <Textarea
                  {...fieldProps('question')}
                  maxLength={CONTACT_LIMITS.question.max}
                  placeholder="Type your question here..."
                  className={`${INPUT_CLASS} h-36.25`}
                />
                <div className="flex items-start justify-between gap-4">
                  <FieldMessage id={errorId('question')} message={fieldErrors.question} />
                  <CharacterCount value={lengths.question ?? 0} max={CONTACT_LIMITS.question.max} />
                </div>
              </Field>

              <SubmitButton
                pending={isSubmitting}
                pendingLabel="Sending"
                className="mx-auto w-full max-w-153.5"
              >
                Send
              </SubmitButton>
            </FieldGroup>
          </form>
        </FormOverlay>
      )}
    </section>
  );
}
