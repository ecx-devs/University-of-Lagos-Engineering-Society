'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Building2,
  HelpCircle,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { SOCIALS } from '../constants';
import { ContactForm } from './ContactForm';

export function ContactInfo() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('unilagengr@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      'Faculty of Engineering, University of Lagos, Akoka, Yaba, Lagos, Nigeria'
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 font-['Neue_Machina']">
      {/* Introduction Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3"> 
          <span>We&apos;re here for you</span>
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get in Touch with ULES
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
          Whether you are an engineering student seeking guidance, an industry partner looking to collaborate, or an alumnus reconnecting with the faculty, we look forward to hearing from you.
        </p>
      </div>

      {/* 4 Quick Communication Channels Grid */}
      <div className="mb-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Channel 1: Email */}
        <div className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Official Email</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              For official society inquiries, formal requests, and sponsorship letters.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-border/50">
            <a
              href="mailto:unilagengr@gmail.com"
              className="block truncate text-xs font-semibold text-primary hover:underline sm:text-sm"
            >
              unilagengr@gmail.com
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {copiedEmail ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy email address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Channel 2: Phone & WhatsApp */}
        <div className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-md">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Phone className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Executive Call Desk</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Direct telephone and WhatsApp lines for student welfare and urgent matters.
            </p>
          </div>
          <div className="mt-5 space-y-2 pt-4 border-t border-border/50 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground font-medium">Damilare (Pres.):</span>
              <a
                href="tel:+2347013779723"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                +234 701 377 9723
              </a>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground font-medium">Joseph (Gen. Sec.):</span>
              <a
                href="tel:+2348100069464"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                +234 810 006 9464
              </a>
            </div>
          </div>
        </div>

        {/* Channel 3: Secretariat Location */}
        <div className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <MapPin className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Secretariat Office</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Faculty of Engineering, University of Lagos, Akoka, Yaba, Lagos.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>Mon – Fri: 9:00 AM – 5:00 PM</span>
            </p>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {copiedAddress ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy office address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Channel 4: Socials */}
        <div className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Share2 className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Connect Online</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Follow ULES on all social networks for real-time updates and highlights.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  aria-label={`ULES on ${name}`}
                  className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-14 grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Office Hours & Walk-ins</h3>
                <span className="text-[11px] font-medium text-emerald-600">Secretariat Open</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="font-medium text-foreground">Monday – Friday:</span>
                <span>9:00 AM – 5:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="font-medium text-foreground">Saturday – Sunday:</span>
                <span className="text-muted-foreground/70">Closed (Inquiries via Email)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-foreground">Faculty Holidays:</span>
                <span className="text-muted-foreground/70">Observes UNILAG Calendar</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-accent/20 p-3.5 border border-border/50 text-xs">
              <p className="text-muted-foreground">
                <strong className="text-foreground">In-Person Consultation:</strong> Feel free to visit the ULES Secretariat on the Ground Floor of the Faculty of Engineering Building during open hours.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <HelpCircle className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Frequently Asked Inquiries</h3>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-foreground">Official Endorsement Letters:</h4>
                <p className="mt-0.5 text-muted-foreground leading-relaxed">
                  Students requesting official society letters or recommendations should email the General Secretary with their full name, department, matriculation number, and purpose.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground">Want to Submit Feedback Anonymously?</h4>
                <p className="mt-0.5 text-muted-foreground leading-relaxed">
                  If you prefer to submit constructive critique or welfare concerns without leaving your name or email, use our dedicated student feedback channel.
                </p>
                <Link
                  href="/student-aids/feedback"
                  className="mt-1.5 inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                >
                  <span>Go to Anonymous Feedback</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>

              <div>
                <h4 className="font-semibold text-foreground">Departmental Associations:</h4>
                <p className="mt-0.5 text-muted-foreground leading-relaxed">
                  Looking to contact specific departmental bodies (e.g. ASES, NISGS, SEES etc.)? Browse the verified association directory.
                </p>
                <Link
                  href="/associations"
                  className="mt-1.5 inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                >
                  <span>View All Associations</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Map & Directions Section */}
      <div className="mb-14 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Locate Us on Campus</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Faculty of Engineering, University of Lagos, Akoka, Yaba, Lagos, Nigeria
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Faculty+of+Engineering+University+of+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="relative h-80 sm:h-96 w-full bg-muted/30">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="University of Lagos Faculty of Engineering Location Map"
            src="https://maps.google.com/maps?q=Faculty%20of%20Engineering%2C%20University%20of%20Lagos&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full"
          />
        </div>

        <div className="bg-muted/20 px-6 py-3.5 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/40">
          <span>📍 Landmark: Directly adjacent to Engineering Lecture Theatre (ELT), UNILAG Akoka Campus.</span>
          <span className="text-[11px] text-muted-foreground/80">Coordinates: 6.5186° N, 3.3970° E</span>
        </div>
      </div>

      {/* Sponsorship & Partnerships Callout Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 sm:p-10 shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <span>Corporate & Alumni Relations</span>
          </span>
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Partner with Nigeria&apos;s Premier Engineering Society
          </h3>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Interested in sponsoring the Engineering Annual Dinner, Dean&apos;s Games, hosting technical hackathons, or recruiting top UNILAG engineering talent? Our corporate relations team would love to collaborate with you.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:unilagengr@gmail.com?subject=Sponsorship%20%26%20Partnership%20Inquiry%20-%20ULES"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-xs transition-transform hover:-translate-y-0.5 hover:bg-primary/90 sm:text-sm"
          >
            Email Sponsorship Desk
          </a>
          <Link
            href="/activities/events"
            className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-background px-5 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent/40 sm:text-sm"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
}
