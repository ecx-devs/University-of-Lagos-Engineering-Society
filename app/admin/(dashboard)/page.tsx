import prisma from '@/lib/prisma';
import Link from 'next/link';
import { auth } from '@/auth';
import {
  Inbox,
  Sparkles,
  Building2,
  Users,
  Newspaper,
  BookOpen,
  Award,
  Calendar,
} from 'lucide-react';
import { getBodyBySlug } from '@/components/constants';
import RecentActivityFeed, { type SerializableActivityItem } from './RecentActivityFeed';

export const revalidate = 0; // Fresh real-time activity feed on every admin visit

export default async function AdminDashboardHome() {
  const session = await auth();
  const dbAdmin = session?.user?.email
    ? await prisma.admin.findUnique({
        where: { email: session.user.email },
      })
    : null;
  const isSuperAdmin = dbAdmin?.role === 'SUPERADMIN';

  const [
    totalSubmissions,
    unreadSubmissions,
    activeAdmins,
    spotlightsCount,
    newsCount,
    blogCount,
    eventsCount,
    executiveCount,
    feedbacks,
    spotlights,
    newsList,
    blogList,
    leaders,
    executiveLeaders,
    settings,
    admins,
  ] = await Promise.all([
    prisma.feedback.count().catch(() => 0),
    prisma.feedback.count({ where: { read: false } }).catch(() => 0),
    prisma.admin.count().catch(() => 0),
    prisma.spotlight.count().catch(() => 0),
    prisma.news.count().catch(() => 0),
    prisma.blogPost.count().catch(() => 0),
    prisma.event.count().catch(() => 0),
    prisma.executiveLeader.count().catch(() => 0),
    prisma.feedback.findMany({ take: 25, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.spotlight.findMany({ take: 25, orderBy: { updatedAt: 'desc' } }).catch(() => []),
    prisma.news.findMany({ take: 25, orderBy: { updatedAt: 'desc' } }).catch(() => []),
    prisma.blogPost.findMany({ take: 25, orderBy: { updatedAt: 'desc' } }).catch(() => []),
    prisma
      .$queryRaw<Array<{ slug: string; name: string; title: string; session: string; updatedAt: Date }>>`
        SELECT "slug", "name", "title", "session", "updatedAt" FROM "AssociationLeader" ORDER BY "updatedAt" DESC LIMIT 25
      `
      .catch(() => []),
    prisma.executiveLeader.findMany({ take: 25, orderBy: { updatedAt: 'desc' } }).catch(() => []),
    prisma
      .$queryRaw<Array<{ key: string; value: string; updatedAt: Date }>>`
        SELECT "key", "value", "updatedAt" FROM "GlobalSetting" ORDER BY "updatedAt" DESC LIMIT 10
      `
      .catch(() => []),
    prisma.admin.findMany({ take: 10, orderBy: { createdAt: 'desc' } }).catch(() => []),
  ]);

  const rawActivities: SerializableActivityItem[] = [];

  // 1. Feedback Submissions
  for (const fb of feedbacks) {
    rawActivities.push({
      id: `fb-${fb.id}`,
      type: 'feedback',
      title: `Feedback from ${fb.name || 'Anonymous Student'}`,
      description: `Subject: "${fb.subject}"`,
      timestamp: new Date(fb.createdAt).toISOString(),
      link: '/admin/submissions',
      badge: fb.read
        ? { text: 'Read', className: 'bg-gray-100 text-gray-600' }
        : { text: 'Unread', className: 'bg-blue-100 text-blue-800 font-semibold' },
      iconType: 'feedback',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    });
  }

  // 2. Spotlights
  for (const sp of spotlights) {
    rawActivities.push({
      id: `sp-${sp.id}`,
      type: 'spotlight',
      title: `${sp.name} Spotlight`,
      description: `${sp.type === 'volunteer' ? 'Volunteer of the Month' : 'Lecturer Feature'} (${sp.monthYear})`,
      timestamp: new Date(sp.updatedAt).toISOString(),
      link: '/admin/spotlights',
      badge: sp.isPublished
        ? { text: 'Published Live', className: 'bg-emerald-100 text-emerald-800 font-semibold' }
        : { text: 'Draft', className: 'bg-amber-100 text-amber-800' },
      iconType: 'spotlight',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    });
  }

  // 3. News Articles & Digest Issues
  for (const n of newsList) {
    rawActivities.push({
      id: `news-${n.id}`,
      type: 'news',
      title: n.title,
      description: `Digest (${n.date}) • ${n.description.slice(0, 70)}...`,
      timestamp: new Date(n.updatedAt).toISOString(),
      link: '/admin/news',
      badge: n.isPublished
        ? { text: 'Live', className: 'bg-emerald-100 text-emerald-800 font-semibold' }
        : { text: 'Draft', className: 'bg-amber-100 text-amber-800' },
      iconType: 'news',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-700',
    });
  }

  // 4. Blog Posts
  for (const b of blogList) {
    rawActivities.push({
      id: `blog-${b.id}`,
      type: 'blog',
      title: b.title,
      description: `${b.category} (${b.date}) • By ${b.author}`,
      timestamp: new Date(b.updatedAt).toISOString(),
      link: '/admin/blog',
      badge: b.isPublished
        ? { text: 'Published Live', className: 'bg-emerald-100 text-emerald-800 font-semibold' }
        : { text: 'Draft', className: 'bg-amber-100 text-amber-800' },
      iconType: 'blog',
      iconBg: 'bg-amber-50',
      iconColor: 'text-[#C85B15]',
    });
  }

  // 5. Association Leadership Updates
  for (const l of leaders) {
    const body = getBodyBySlug(l.slug);
    rawActivities.push({
      id: `assoc-${l.slug}`,
      type: 'association',
      title: `${body?.name || l.slug.toUpperCase()} Leadership`,
      description: `${l.name} (${l.title} • ${l.session} Session)`,
      timestamp: new Date(l.updatedAt).toISOString(),
      link: '/admin/associations',
      badge: { text: 'Leadership', className: 'bg-emerald-100 text-emerald-800' },
      iconType: 'association',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    });
  }

  // 6. Executive Council Updates
  for (const ex of executiveLeaders) {
    rawActivities.push({
      id: `exco-${ex.id}`,
      type: 'leadership',
      title: `Executive Leader: ${ex.name}`,
      description: `${ex.title} • ${ex.department || 'Engineering Faculty'}`,
      timestamp: new Date(ex.updatedAt).toISOString(),
      link: '/admin/leadership',
      badge: ex.isPublished
        ? { text: 'Published Live', className: 'bg-emerald-100 text-emerald-800 font-semibold' }
        : { text: 'Draft', className: 'bg-amber-100 text-amber-800' },
      iconType: 'leadership',
      iconBg: 'bg-purple-50',
      iconColor: 'text-[#170A51]',
    });
  }

  // 7. Global Settings (Academic Session)
  for (const s of settings) {
    if (s.key === 'academic_session') {
      rawActivities.push({
        id: `setting-${s.key}-${new Date(s.updatedAt).getTime()}`,
        type: 'setting',
        title: 'Global Academic Session Updated',
        description: `Tenure synchronized platform-wide to ${s.value}`,
        timestamp: new Date(s.updatedAt).toISOString(),
        link: '/admin/associations',
        badge: { text: 'Session Sync', className: 'bg-purple-100 text-purple-800 font-semibold' },
        iconType: 'setting',
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
      });
    }
  }

  // 8. Admin Registrations (Only visible to superadmins)
  if (isSuperAdmin) {
    for (const adm of admins) {
      rawActivities.push({
        id: `admin-${adm.id}`,
        type: 'admin',
        title: `Admin Account: ${adm.name || adm.email}`,
        description: `Role: ${adm.role} • ${adm.email}`,
        timestamp: new Date(adm.createdAt).toISOString(),
        link: '/admin/users',
        badge: { text: 'Admin', className: 'bg-gray-100 text-gray-700' },
        iconType: 'admin',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
      });
    }
  }

  return (
    <div className="space-y-8 pb-16 font-['Neue_Machina']">
      {/* Overview Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
          Admin Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back to the ULES Admin Portal. Live platform analytics and recent updates across engineering activities.
        </p>
      </div>

      {/* Metric Cards Grid - Compact, short-height responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Executive Council */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#170A51]/40 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-purple-50 flex items-center justify-center text-[#170A51] shrink-0">
              <Award className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                Executive Council
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#170A51] leading-none">
                  {executiveCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  EXCO Profiles
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/leadership"
            className="text-xs font-semibold text-primary hover:underline shrink-0 flex items-center gap-0.5"
          >
            Manage &rarr;
          </Link>
        </div>

        {/* Card 2: Submissions */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#106333]/30 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-[#106333]/10 flex items-center justify-center text-[#106333] shrink-0">
              <Inbox className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                Submissions
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#106333] leading-none">
                  {totalSubmissions.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  {unreadSubmissions > 0 ? `${unreadSubmissions} unread` : 'All caught up'}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/submissions"
            className="text-xs font-semibold text-[#106333] hover:underline shrink-0 flex items-center gap-0.5"
          >
            View &rarr;
          </Link>
        </div>

        {/* Card 3: News & Digest */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#185A48]/30 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-[#185A48]/10 flex items-center justify-center text-[#185A48] shrink-0">
              <Newspaper className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                News & Digest
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#185A48] leading-none">
                  {newsCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  Issues & News
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/news"
            className="text-xs font-semibold text-[#185A48] hover:underline shrink-0 flex items-center gap-0.5"
          >
            Manage &rarr;
          </Link>
        </div>

        {/* Card 4: Blog Articles */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#C85B15]/30 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-[#C85B15]/10 flex items-center justify-center text-[#C85B15] shrink-0">
              <BookOpen className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                Blog Articles
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#C85B15] leading-none">
                  {blogCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  Stories
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/blog"
            className="text-xs font-semibold text-[#C85B15] hover:underline shrink-0 flex items-center gap-0.5"
          >
            CMS &rarr;
          </Link>
        </div>

        {/* Card 5: Events & Gallery */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#170A51]/30 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-[#170A51]/10 flex items-center justify-center text-[#170A51] shrink-0">
              <Calendar className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                Events & Gallery
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#170A51] leading-none">
                  {eventsCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  Events
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/events"
            className="text-xs font-semibold text-[#170A51] hover:underline shrink-0 flex items-center gap-0.5"
          >
            Manage &rarr;
          </Link>
        </div>

        {/* Card 6: Spotlight Features */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#C85B15]/30 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-[#C85B15]/10 flex items-center justify-center text-[#C85B15] shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                Spotlights
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#C85B15] leading-none">
                  {spotlightsCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  Features
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/spotlights"
            className="text-xs font-semibold text-[#C85B15] hover:underline shrink-0 flex items-center gap-0.5"
          >
            Manage &rarr;
          </Link>
        </div>

        {/* Card 7: Associations Tracked */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#106333]/30 transition-all flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-lg bg-[#106333]/10 flex items-center justify-center text-[#106333] shrink-0">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                Associations
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-['Anton'] text-[#106333] leading-none">
                  15
                </span>
                <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                  9 Depts • 6 Bodies
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin/associations"
            className="text-xs font-semibold text-[#106333] hover:underline shrink-0 flex items-center gap-0.5"
          >
            Roster &rarr;
          </Link>
        </div>

        {/* Card 8: Active Admins (Visible ONLY to Super Admin) */}
        {isSuperAdmin && (
          <div className="bg-white rounded-xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xs hover:border-[#22203E]/30 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-lg bg-[#22203E]/10 flex items-center justify-center text-[#22203E] shrink-0">
                <Users className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
                  Active Admins
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-['Anton'] text-gray-900 leading-none">
                    {activeAdmins.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate hidden sm:inline">
                    Authorized
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-[#170A51] hover:underline shrink-0 flex items-center gap-0.5"
            >
              Admins &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Section: Filterable, Paginated Recent Activity Feed */}
      <RecentActivityFeed activities={rawActivities} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
