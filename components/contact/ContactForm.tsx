'use client';

import { useState, useTransition } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitFeedbackAction } from '@/app/actions/feedback';

const CATEGORIES = [
  'General Inquiry',
  'Sponsorship & Partnership',
  'Academic & Student Affairs',
  'Media & Press',
  'Website / Technical',
] as const;

export function ContactForm() {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setError('Please write a message of at least 10 characters.');
      return;
    }

    const finalSubject = subject.trim()
      ? subject.trim()
      : `${category} from ${name.trim()}`;

    const formattedSubject = department.trim()
      ? `[${category}] ${finalSubject} (${department.trim()})`
      : `[${category}] ${finalSubject}`;

    const formattedMessage = department.trim()
      ? `[Affiliation/Department: ${department.trim()}]\n\n${message.trim()}`
      : message.trim();

    startTransition(async () => {
      try {
        const res = await submitFeedbackAction({
          name: name.trim(),
          email: email.trim(),
          subject: formattedSubject,
          message: formattedMessage,
          company_website: honeypot,
        });

        if (res?.ok) {
          setSubmitted(true);
        } else {
          setError('Failed to send message. Please try again or email us directly at unilagengr@gmail.com.');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        setError('Something went wrong. Please try again or email unilagengr@gmail.com.');
      }
    });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setDepartment('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setError(null);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center shadow-xs">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Message Delivered!</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Thank you for reaching out, <strong className="text-foreground">{name}</strong>. Your message has been sent directly to the ULES Secretariat desk. We will review and respond to <strong className="text-foreground">{email}</strong> promptly.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground sm:text-2xl">
          Send Us a Message
        </h3>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Have an inquiry, partnership proposal, or suggestion? Fill in the details below and we&apos;ll get back to you shortly.
        </p>
      </div>

      {/* Category Selection Pills */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Select Topic / Purpose
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field for bot spam */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="company_website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Babatunde Fashola"
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Department or Affiliation */}
          <div>
            <label htmlFor="contact-department" className="mb-1.5 block text-xs font-semibold text-foreground">
              Department or Affiliation <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              id="contact-department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Mechanical Eng, Sponsor, Alumni"
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
          </div>

          {/* Custom Subject */}
          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-foreground">
              Subject <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`e.g. Regarding ${category}`}
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
              Message <span className="text-destructive">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {message.length}/1000
            </span>
          </div>
          <textarea
            id="contact-message"
            required
            rows={5}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message or inquiry here..."
            className="w-full resize-y rounded-xl border border-border/80 bg-background p-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
