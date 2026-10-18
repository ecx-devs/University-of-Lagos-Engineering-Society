import Link from 'next/link';
import { PageBanner } from '@/components/section/PageBanner';
import { pageMetadata } from '@/lib/seo';
import { CURRENT_ACADEMIC_SESSION } from '@/components/constants';
import {
  FileText,
  Users,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Compass,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'Simple, transparent terms and community guidelines for using the University of Lagos Engineering Society (ULES) website and services.',
  path: '/terms',
  keywords: ['ULES terms of service', 'UNILAG engineering website terms', 'student society guidelines'],
});

export default function TermsOfServicePage() {
  const lastUpdated = 'October 2026';

  return (
    <>
      <PageBanner
        title="Terms of Service"
        tagline="Simple guidelines for using the ULES website and community portal."
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 font-['Neue_Machina']">
        {/* Navigation Switcher Pills */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl bg-accent/40 p-1 border border-border/50 text-xs">
            <Link
              href="/privacy"
              className="rounded-lg px-4 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-background/80"
            >
              Privacy Policy
            </Link>
            <span className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-xs">
              Terms of Service
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Session <span className="font-semibold text-foreground">{CURRENT_ACADEMIC_SESSION}</span> • Last Updated: <span className="font-semibold text-foreground">{lastUpdated}</span>
          </div>
        </div>

        {/* Quick Highlights / "At a Glance" Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Respectful Community</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              We foster a supportive, collaborative environment for all engineering students, lecturers, and partners.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <BookOpen className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Open Educational Sharing</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Feel free to cite, reference, and share our digests and student articles for academic non-commercial purposes.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <MessageSquare className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Constructive Student Voice</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Our feedback channel is here to solve real faculty issues, voice student needs, and improve campus life.
            </p>
          </div>
        </div>

        {/* Core Terms Content */}
        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          {/* Section 1 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                1. Agreement to Terms
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              Welcome to the official online portal of the{' '}
              <strong className="text-foreground">University of Lagos Engineering Society (ULES)</strong>{' '}
              (<code className="rounded bg-muted px-1.5 py-0.5 text-xs">ules.com.ng</code>). By visiting, reading, or submitting information through our website, you agree to these simple and transparent Terms of Service.
            </p>
            <p className="mt-3 text-muted-foreground">
              These terms are designed to be practical, straightforward, and supportive of our engineering student community. If you do not agree with any part of these terms, please discontinue using the website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Compass className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                2. Purpose of the Platform
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              The ULES platform is created and maintained by the ULES Executive Council and its media & technology team to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Provide official news, bi-weekly digests, and faculty announcements.</li>
              <li>Archive and showcase student achievements, volunteer contributions, and faculty events.</li>
              <li>Maintain a verified directory of departmental associations and specialized engineering bodies.</li>
              <li>Offer a confidential and direct channel for student feedback, suggestions, and academic inquiries.</li>
              <li>Connect students with verified scholarships, internships, hackathons, and career development initiatives.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                3. Community Conduct & Acceptable Use
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              To ensure a welcoming and productive environment for all students and visitors, you agree to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Act with integrity:</strong> Submit truthful and constructive messages through our feedback, contact, or contribution forms.
              </li>
              <li>
                <strong className="text-foreground">Respect others:</strong> Refrain from submitting harassing, defamatory, vulgar, hateful, or discriminatory comments targeted at students, lecturers, or staff.
              </li>
              <li>
                <strong className="text-foreground">Protect security:</strong> Not attempt to disrupt the website, inject malicious code, harvest user data, or bypass administrative security mechanisms.
              </li>
              <li>
                <strong className="text-foreground">Respect anonymity:</strong> Never attempt to unmask, retaliate against, or misrepresent anonymous student feedback submissions.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                4. Intellectual Property & Sharing Guidelines
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              All original content published on this website — including the ULES logo, editorial digests, student articles, event graphics, and design layouts — is owned by the University of Lagos Engineering Society or credited to individual student contributors.
            </p>
            <div className="mt-4 rounded-xl bg-accent/30 p-4 border border-border/50">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Academic & Fair Use Sharing:</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                You are welcome and encouraged to quote, share, and distribute ULES articles, newsletters, and announcements for educational, campus, or non-commercial purposes, provided you give clear attribution to the author and include a link back to <code className="text-primary font-mono">ules.com.ng</code>.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                5. Student Submissions & Feedback
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              We value your input. When you submit feedback or guest articles to ULES:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Feedback submissions:</strong> Handled in confidence by the executive team to advocate for engineering students with department heads, laboratory managers, and faculty leadership.
              </li>
              <li>
                <strong className="text-foreground">Guest blogs & articles:</strong> Writers retain personal authorship while granting ULES a license to display, edit for clarity, and format the piece on our blog or newsletter.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <AlertCircle className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                6. Disclaimers & Accuracy
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              The information provided on this website is prepared in good faith to assist engineering students and the wider public. However:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Academic dates, lecture schedules, and examination timetables are subject to official University of Lagos Senate updates. In the event of any discrepancies, official UNILAG communications supersede website listings.
              </li>
              <li>
                External links to departmental associations, software repositories, or sponsor websites are provided solely for convenience. ULES does not endorse or control external third-party sites.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/20 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <HelpCircle className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                7. Questions, Enquiries & Office Location
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              If you have questions regarding these terms, need permission for special content use, or want to partner with ULES, please contact the Executive Council:
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Secretariat:</strong> Faculty of Engineering, University of Lagos, Akoka, Yaba, Lagos, Nigeria
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:unilagengr@gmail.com" className="text-primary font-semibold hover:underline">
                  unilagengr@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">Official Website:</strong>{' '}
                <a href="https://ules.com.ng" className="text-primary font-semibold hover:underline">
                  ules.com.ng
                </a>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border/40">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <span>Review our Privacy Policy</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/student-aids/feedback"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <span>Submit Student Feedback</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
