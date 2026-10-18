import Link from 'next/link';
import { PageBanner } from '@/components/section/PageBanner';
import { pageMetadata } from '@/lib/seo';
import { CURRENT_ACADEMIC_SESSION } from '@/components/constants';
import {
  ShieldCheck,
  Lock,
  Eye,
  Camera,
  FileText,
  UserCheck,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'Learn how the University of Lagos Engineering Society (ULES) collects, protects, and respects your data across our website and student services.',
  path: '/privacy',
  keywords: ['ULES privacy policy', 'UNILAG engineering privacy', 'student data protection'],
});

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 2026';

  return (
    <>
      <PageBanner
        title="Privacy Policy"
        tagline="How we handle your information and protect your privacy."
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 font-['Neue_Machina']">
        {/* Navigation Switcher Pills */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row">
          <div className="flex items-center gap-2 rounded-xl bg-accent/40 p-1 border border-border/50 text-xs">
            <span className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-xs">
              Privacy Policy
            </span>
            <Link
              href="/terms"
              className="rounded-lg px-4 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-background/80"
            >
              Terms of Service
            </Link>
          </div>

          <div className="text-xs text-muted-foreground">
            Session <span className="font-semibold text-foreground">{CURRENT_ACADEMIC_SESSION}</span> • Last Updated: <span className="font-semibold text-foreground">{lastUpdated}</span>
          </div>
        </div>

        {/* Quick Highlights / "At a Glance" Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lock className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Zero Data Selling</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              We are a non-profit student society. We never sell, rent, or monetize your personal data with advertisers.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <UserCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Anonymous Feedback</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              You can submit feedback and suggestions to the Executive Council completely anonymously anytime.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-xs transition-transform hover:-translate-y-0.5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Camera className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Media Removal Respect</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Featured in an event photo or gallery and want it taken down? Simply send us an email and we will remove it.
            </p>
          </div>
        </div>

        {/* Core Policy Content */}
        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          {/* Section 1 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                1. Introduction & Overview
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              Welcome to the official digital portal of the{' '}
              <strong className="text-foreground">University of Lagos Engineering Society (ULES)</strong>{' '}
              (<code className="rounded bg-muted px-1.5 py-0.5 text-xs">ules.com.ng</code>). We are the premier student 
              body representing undergraduate and postgraduate students across all engineering departments in the Faculty of Engineering, 
              University of Lagos (UNILAG).
            </p>
            <p className="mt-3 text-muted-foreground">
              This Privacy Policy explains in simple terms how we collect, use, and protect any personal information you provide when visiting our website, subscribing to our bi-weekly digests, submitting feedback, or participating in society activities.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                2. Information We Collect
              </h2>
            </div>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">a. Student Feedback & Enquiries</h3>
                <p className="mt-1">
                  When you contact us or submit an issue via our Student Feedback form, you may provide your name, email address, department, and message. Providing your name and email is completely optional — anonymous submissions are fully supported.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">b. Newsletter Subscriptions</h3>
                <p className="mt-1">
                  If you sign up for the ULES Bi-Weekly Digest or announcement list, we store your email address solely to deliver relevant engineering publications, scholarships, and event updates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">c. Spotlight & Executive Profiles</h3>
                <p className="mt-1">
                  Honorees featured in the ULES Spotlight (Volunteers of the Month, Lecturers of the Month) and Executive Council members provide their names, academic departments, photos, and short bios with explicit mutual agreement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">d. Technical & Usage Data</h3>
                <p className="mt-1">
                  Like almost all modern websites, our hosting servers collect basic non-identifiable technical data (browser type, device screen size, referring page, and general access times) to ensure the website loads fast and reliably on all devices.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eye className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                3. How We Use Your Information
              </h2>
            </div>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">To represent and support students:</strong> Feedback submitted about faculty facilities, course timetables, or student welfare is reviewed by the ULES Executive Council to take actionable steps with faculty administration.
              </li>
              <li>
                <strong className="text-foreground">To communicate effectively:</strong> Sending important faculty announcements, conference invites, hackathons, and society digests that you have subscribed to.
              </li>
              <li>
                <strong className="text-foreground">To celebrate excellence:</strong> Spotlighting outstanding academic and leadership achievements within the Faculty of Engineering.
              </li>
              <li>
                <strong className="text-foreground">To maintain platform security:</strong> Protecting our website against automated spam, abusive submissions, or denial of service attacks.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Camera className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                4. Photography & Event Media
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              ULES hosts numerous public student gatherings, including the Engineering Annual Dinner, Dean’s Games, Fresher’s Orientation, Career Fairs, and Technical Workshops. Photographs and videos taken at these events are often published in our{' '}
              <Link href="/activities/gallery" className="text-primary font-semibold hover:underline">
                Event Gallery
              </Link>{' '}
              to document campus life.
            </p>
            <div className="mt-4 rounded-xl bg-accent/30 p-4 border border-border/50">
              <p className="text-xs text-foreground font-medium">
                <strong>Photo Removal Request:</strong> If a photograph of you appears in our gallery or stories and you would prefer it removed for personal or privacy reasons, please email us with the link or photo title at{' '}
                <a href="mailto:unilagengr@gmail.com" className="text-primary font-semibold hover:underline">
                  unilagengr@gmail.com
                </a>
                . We will respect your wish and promptly take it down.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                5. Data Security & Storage
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              We take reasonable administrative and technical precautions to safeguard the data you entrust to us. Submissions and subscription data are transmitted over encrypted HTTPS connections and stored securely using reputable cloud infrastructure providers with restricted administrator access.
            </p>
            <p className="mt-3 text-muted-foreground">
              We do not sell, trade, or transfer your personally identifiable information to external third parties. Trusted service providers who assist us in operating our website or sending emails are bound by strict confidentiality obligations.
            </p>
          </section>

          {/* Section 6 */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserCheck className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                6. Your Rights & Choices
              </h2>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in the footer of any digest email.</li>
              <li>You can request a copy, correction, or deletion of any personal information you have shared with us.</li>
              <li>You have the right to browse our platform without providing any personal identifiers.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/20 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <HelpCircle className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                7. Questions & Contact Information
              </h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              If you have any questions, feedback, or concerns regarding this Privacy Policy or how your information is handled, feel free to reach out to the ULES Secretariat:
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Office:</strong> ULES Secretariat, Faculty of Engineering, University of Lagos, Akoka, Lagos, Nigeria
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
                href="/terms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <span>Read our Terms of Service</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <span>Contact Page</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
