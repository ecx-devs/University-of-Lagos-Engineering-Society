import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect, RedirectType } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  Award,
  Building2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  BookOpen,
  Trophy,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import {
  getAllBodies,
  getBodyBySlug,
  DEPARTMENTAL_BODIES,
  SUB_BODIES,
  SITE_URL,
} from '@/components/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { associationJsonLd, pageMetadata, SITE } from '@/lib/seo';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { CopyEmailButton } from '@/components/association/CopyEmailButton';
import { getAssociationBodyWithDynamicLeadership } from '@/app/actions/associations';
export const revalidate = 60;

interface AssociationDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const params: Array<{ slug: string }> = [];
  for (const body of getAllBodies()) {
    params.push({ slug: body.slug });
    if (body.aliases) {
      for (const alias of body.aliases) {
        params.push({ slug: alias });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: AssociationDetailPageProps) {
  const { slug } = await params;
  const body = (await getAssociationBodyWithDynamicLeadership(slug)) ?? getBodyBySlug(slug);
  if (!body) return {};

  const seoTitle = body.seoTitle ?? `${body.acronym} UNILAG – ${body.tagline} | ULES`;
  const seoDescription =
    body.seoDescription ??
    `Official profile of ${body.acronym} (ULES) – ${body.name}. ${body.tagline} at the University of Lagos Faculty of Engineering under ULES.`;

  const keywords = Array.from(
    new Set([
      ...(body.seoKeywords ?? []),
      body.name,
      body.acronym,
      `${body.acronym} ULES`,
      `${body.acronym} UNILAG`,
      `${body.acronym} University of Lagos`,
      body.tagline,
      `${body.tagline} ULES`,
      `${body.tagline} UNILAG`,
      body.departmentAffiliation,
      'ULES associations',
      'UNILAG engineering',
      'Faculty of Engineering UNILAG',
      ...(body.alternateNames ?? []),
      ...(body.aliases ?? []),
    ])
  );

  return pageMetadata({
    title: { absolute: seoTitle },
    description: seoDescription,
    path: `/associations/${body.slug}`,
    image: body.imageSrc,
    keywords,
  });
}

export default async function AssociationDetailPage({ params }: AssociationDetailPageProps) {
  const { slug } = await params;
  const canonicalBody = (await getAssociationBodyWithDynamicLeadership(slug)) ?? getBodyBySlug(slug);
  if (!canonicalBody) {
    notFound();
  }

  // If visited via an alias or alternate capitalization, permanently redirect to canonical URL
  if (slug.toLowerCase() !== canonicalBody.slug.toLowerCase()) {
    redirect(`/associations/${canonicalBody.slug}`, RedirectType.replace);
  }

  const body = canonicalBody;

  // Related associations for quick navigation (other bodies of the same or alternating type)
  const relatedBodies = (body.type === 'departmental' ? DEPARTMENTAL_BODIES : SUB_BODIES)
    .filter((b) => b.slug !== body.slug)
    .slice(0, 4);

  // Split prose into clean paragraphs
  const paragraphs = body.body
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={associationJsonLd({
          name: body.name,
          acronym: body.acronym,
          alternateNames: body.alternateNames,
          description: body.seoDescription ?? body.tagline,
          path: `/associations/${body.slug}`,
          image: body.imageSrc,
          foundingDate: body.establishedYear,
          departmentAffiliation: body.departmentAffiliation,
          leaderName: body.president?.name,
          leaderTitle: body.president?.title,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          socials: body.socials,
          focusAreas: body.focusAreas,
          flagshipEvents: body.flagshipEvents,
        })}
      />

      <main className="min-h-screen bg-background text-foreground pb-24 selection:bg-accent selection:text-white">
        {/* Subtle Decorative Background Glow */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -left-40 -z-10 h-[450px] w-[450px] rounded-full bg-accent/5 blur-3xl" />

          {/* Top Breadcrumb & Back Bar */}
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
              <Link
                href="/associations"
                className="text-primary hover:text-accent group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <ArrowLeft
                  className="size-4 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                Back to all Associations
              </Link>

              <nav aria-label="Breadcrumb" className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link href="/associations" className="hover:text-foreground transition-colors">
                  Associations
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                  {body.name}
                </span>
              </nav>
            </div>
          </div>

          {/* Hero Banner Section */}
          <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
            <Reveal>
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="flex justify-center lg:col-span-4 lg:justify-start">
                  <div className="relative flex aspect-square w-56 sm:w-64 md:w-72 items-center justify-center rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-md">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                    <Image
                      src={body.imageSrc}
                      alt={`${body.name} Logo`}
                      width={body.imageWidth ?? 240}
                      height={body.imageHeight ?? 240}
                      className="max-h-full max-w-full object-contain p-2"
                      priority
                    />
                  </div>
                </div>

                {/* Body Details Header */}
                <div className="space-y-4 text-center lg:col-span-8 lg:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                      {body.typeLabel}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {body.acronym} | ULES
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                      UNILAG Engineering
                    </span>
                  </div>

                  <h1 className="text-foreground font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight">
                    <span>{body.name}</span>
                    <span className="sr-only">
                      {' '}
                      - {body.acronym} UNILAG | {body.tagline} | University of Lagos Engineering Society (ULES)
                    </span>
                  </h1>

                  <p className="text-accent text-lg sm:text-xl font-medium leading-relaxed">
                    {body.tagline}
                  </p>

                  {body.mottoOrVision && (
                    <div className="inline-block border-l-2 border-accent pl-4 text-left italic text-muted-foreground text-sm sm:text-base">
                      &ldquo;{body.mottoOrVision}&rdquo;
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-2 text-sm text-muted-foreground lg:justify-start">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      <span>{body.departmentAffiliation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="size-4 text-primary shrink-0" aria-hidden="true" />
                      <span>Led by {body.president.name} ({body.president.title})</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* Quick Stats Section */}
          <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Reveal delay={0.1}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="hover-lift flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Year Established
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {body.establishedYear}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Historic foundation
                    </p>
                  </div>
                </div>

                {/* Member Count */}
                <div className="hover-lift flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Users className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Active Membership
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {body.memberCount}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Active student engineers
                    </p>
                  </div>
                </div>

                {/* Current President */}
                <div className="hover-lift flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="size-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Current {body.president.title}
                    </p>
                    <p className="mt-1 text-lg font-bold text-foreground truncate">
                      {body.president.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {body.president.academicYear} Session
                    </p>
                  </div>
                </div>

                {/* Department / Faculty Scope */}
                <div className="hover-lift flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Building2 className="size-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Institutional Scope
                    </p>
                    <p className="mt-1 text-base font-bold text-foreground truncate">
                      {body.acronym} UNILAG
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      Faculty of Engineering
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

              {/* Main Content Section */}
              <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                  <div className="space-y-10 lg:col-span-7 xl:col-span-8">
                    <Reveal>
                      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
                        <div className="mb-6 flex items-center gap-3 border-b border-border/80 pb-4">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="size-5" aria-hidden="true" />
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            About {body.name}
                          </h2>
                        </div>

                        <div className="space-y-5 text-base/7 text-foreground/90 lg:text-lg/8">
                          {paragraphs.map((para, idx) => (
                            <p key={idx} className="leading-relaxed">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </Reveal>

                    {/* Flagship Events & Initiatives */}
                    {body.flagshipEvents && body.flagshipEvents.length > 0 && (
                      <Reveal delay={0.1}>
                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
                          <div className="mb-6 flex items-center gap-3 border-b border-border/80 pb-4">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                              <Trophy className="size-5" aria-hidden="true" />
                            </div>
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                                Flagship Programs & Events
                              </h2>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Key conferences, hackathons, and activities organized by {body.acronym}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {body.flagshipEvents.map((event, idx) => (
                              <div
                                key={idx}
                                className="group rounded-xl border border-border/80 bg-muted/30 p-5 transition-all hover:border-primary/40 hover:bg-muted/60"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    {idx + 1}
                                  </span>
                                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                                    {event.name}
                                  </h3>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Reveal>
                    )}

                    {/* Core Disciplines & Focus Areas */}
                    {body.focusAreas && body.focusAreas.length > 0 && (
                      <Reveal delay={0.15}>
                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
                          <h2 className="mb-4 text-xl font-bold text-foreground">
                            Core Disciplines & Focus Areas
                          </h2>
                          <div className="flex flex-wrap gap-2.5">
                            {body.focusAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                              >
                                <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Reveal>
                    )}
                  </div>

                  {/* Leadership & Quick Facts Sidebar */}
                  <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
                    <Reveal delay={0.1}>
                      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">
                          Executive Leadership
                        </span>
                      <h3 className="mt-1 text-xl font-bold text-foreground">
                        Current Leadership Profile
                      </h3>

                      <div className="mt-6 flex items-center gap-4 border-t border-border/80 pt-5">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-xl font-bold text-primary border border-primary/20">
                          {body.president.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground text-lg truncate">
                            {body.president.name}
                          </p>
                          <p className="text-accent text-sm font-semibold">
                            {body.president.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {body.president.academicYear} Academic Session
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                        <p>
                          Elected to represent and steward {body.name} under the faculty charter of the
                          University of Lagos Engineering Society.
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  {/* Key Points & Summary Highlights Card */}
                  <Reveal delay={0.15}>
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Institutional Overview
                      </h3>
                      <ul className="divide-y divide-border/60 text-sm">
                        <li className="py-3 first:pt-0 flex items-start justify-between gap-3">
                          <span className="text-muted-foreground font-medium">Year Founded</span>
                          <span className="text-foreground font-semibold text-right">{body.establishedYear}</span>
                        </li>
                        <li className="py-3 flex items-start justify-between gap-3">
                          <span className="text-muted-foreground font-medium">Active Membership</span>
                          <span className="text-foreground font-semibold text-right">{body.memberCount}</span>
                        </li>
                        <li className="py-3 flex items-start justify-between gap-3">
                          <span className="text-muted-foreground font-medium">Current {body.president.title}</span>
                          <span className="text-foreground font-semibold text-right truncate max-w-[160px] sm:max-w-[200px]">
                            {body.president.name}
                          </span>
                        </li>
                        {body.coChair && (
                          <li className="py-3 flex items-start justify-between gap-3">
                            <span className="text-muted-foreground font-medium">Co-Chair</span>
                            <span className="text-foreground font-semibold text-right truncate max-w-[160px] sm:max-w-[200px]">
                              {body.coChair}
                            </span>
                          </li>
                        )}
                        {body.headOfDepartment && (
                          <li className="py-3 flex items-start justify-between gap-3">
                            <span className="text-muted-foreground font-medium">Head of Dept</span>
                            <span className="text-foreground font-semibold text-right truncate max-w-[160px] sm:max-w-[200px]">
                              {body.headOfDepartment}
                            </span>
                          </li>
                        )}
                        <li className="py-3 flex items-start justify-between gap-3">
                          <span className="text-muted-foreground font-medium">Academic Session</span>
                          <span className="text-foreground font-semibold text-right">{body.president.academicYear}</span>
                        </li>
                        <li className="py-3 flex items-start justify-between gap-3">
                          <span className="text-muted-foreground font-medium">Affiliation</span>
                          <span className="text-foreground font-semibold text-right">ULES UNILAG</span>
                        </li>
                        <li className="py-3 last:pb-0 flex items-start justify-between gap-3">
                          <span className="text-muted-foreground font-medium">Campus</span>
                          <span className="text-foreground font-semibold text-right">Akoka, Lagos</span>
                        </li>
                      </ul>
                    </div>
                  </Reveal>

                  {/* Contact & Faculty Headquarters Card */}
                  <Reveal delay={0.2}>
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Connect & Secretariat
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <MapPin className="size-4 text-primary shrink-0 mt-1" aria-hidden="true" />
                          <div className="space-y-0.5">
                            {body.type === 'departmental' ? (
                              <>
                                <p className="font-semibold text-foreground text-sm">
                                  {body.departmentAffiliation}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Faculty of Engineering, University of Lagos, Akoka, Yaba, Lagos
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold text-foreground text-sm">
                                  Faculty of Engineering
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  University of Lagos, Akoka, Yaba, Lagos
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-2.5 text-muted-foreground">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Mail className="size-4 text-primary shrink-0" aria-hidden="true" />
                            <a
                              href={`mailto:${body.contactEmail}`}
                              className="hover:text-primary transition-colors text-xs sm:text-sm font-medium text-foreground truncate"
                              title={`Email ${body.contactEmail}`}
                            >
                              {body.contactEmail}
                            </a>
                          </div>
                          <CopyEmailButton email={body.contactEmail} />
                        </div>

                        {body.contactPhone && (
                          <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-2.5 text-muted-foreground">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Phone className="size-4 text-primary shrink-0" aria-hidden="true" />
                              <a
                                href={`tel:${body.contactPhone.replace(/[^+\d]/g, '')}`}
                                className="hover:text-primary transition-colors text-xs sm:text-sm font-medium text-foreground truncate"
                                title={`Call ${body.name} secretariat hotline`}
                              >
                                {body.contactPhone}
                              </a>
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider pr-1">
                              Hotline
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/80">
                        <a
                          href={`mailto:${body.contactEmail}?subject=Inquiry regarding ${body.name}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                        >
                          <Mail className="size-4" aria-hidden="true" />
                          Contact Secretariat
                        </a>
                      </div>
                    </div>
                  </Reveal>

                  {/* Quick Navigation to Other Bodies */}
                  <Reveal delay={0.25}>
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                      <h3 className="text-base font-bold text-foreground mb-3">
                        More {body.type === 'departmental' ? 'Departmental' : 'Sub'} Bodies
                      </h3>
                      <div className="space-y-2">
                        {relatedBodies.map((related) => (
                          <Link
                            key={related.id}
                            href={`/associations/${related.slug}`}
                            className="group flex items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-muted"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background p-1">
                                <Image
                                  src={related.imageSrc}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground text-sm group-hover:text-primary truncate">
                                  {related.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {related.tagline}
                                </p>
                              </div>
                            </div>
                            <ArrowRight
                              className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0 ml-2"
                              aria-hidden="true"
                            />
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/80 text-center">
                        <Link
                          href="/associations"
                          className="text-primary hover:text-accent inline-flex items-center gap-1 text-xs font-semibold"
                        >
                          View all 15 associations &rarr;
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                </aside>
              </div>
            </section>

            {/* Bottom Call to Action Banner */}
            <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
              <Reveal delay={0.2}>
                <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-8 sm:p-12 text-center shadow-xs">
                  <h2 className="font-heading text-3xl sm:text-4xl text-foreground uppercase tracking-tight">
                    Interested in collaborating with {body.acronym}?
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-base sm:text-lg">
                    Reach out to the executive committee or explore opportunities across the 10 departments
                    and 6 sub-bodies of the University of Lagos Engineering Society.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <a
                      href={`mailto:${body.contactEmail}?subject=Collaboration with ${body.name}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <Mail className="size-4" aria-hidden="true" />
                      Reach Out
                    </a>
                    <Link
                      href="/associations"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-xs hover:border-primary/50 transition-colors"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      All Associations
                    </Link>
                  </div>
                </div>
              </Reveal>
            </section>
          </div>
        </main>
      </>
    );
  }
