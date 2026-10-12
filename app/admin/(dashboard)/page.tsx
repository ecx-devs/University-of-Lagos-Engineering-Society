import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Inbox,
  Sparkles,
  Building2,
  Users,
} from 'lucide-react';
import { getBodyBySlug } from '@/components/constants';
import RecentActivityFeed, { type SerializableActivityItem } from './RecentActivityFeed';

export const revalidate = 0; // Fresh real-time activity feed on every admin visit

export default async function AdminDashboardHome() {
  const [
    totalSubmissions,
    unreadSubmissions,
    activeAdmins,
    spotlightsCount,
    feedbacks,
    spotlights,
    leaders,
    settings,
    admins,
  ] = await Promise.all([
    prisma.feedback.count().catch(() => 0),
    prisma.feedback.count({ where: { read: false } }).catch(() => 0),
    prisma.admin.count().catch(() => 0),
    prisma.spotlight.count().catch(() => 0),
    prisma.feedback.findMany({ take: 25, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.spotlight.findMany({ take: 25, orderBy: { updatedAt: 'desc' } }).catch(() => []),
    prisma
      .$queryRaw<Array<{ slug: string; name: string; title: string; session: string; updatedAt: Date }>>`
        SELECT "slug", "name", "title", "session", "updatedAt" FROM "AssociationLeader" ORDER BY "updatedAt" DESC LIMIT 25
      `
      .catch(() => []),
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

  // 3. Association Leadership Updates
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

  // 4. Global Settings (Academic Session)
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

  // 5. Admin Registrations
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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Submissions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#170A51]/30">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Student Submissions
            </h3>
            <div className="size-9 rounded-lg bg-[#170A51]/10 flex items-center justify-center text-[#170A51]">
              <Inbox className="size-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-['Anton'] text-[#170A51]">
              {totalSubmissions.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {unreadSubmissions > 0 ? `${unreadSubmissions} unread feedback` : 'All caught up'}
            </span>
            <Link href="/admin/submissions" className="text-[#106333] hover:underline font-semibold flex items-center gap-1">
              View &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Spotlights */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#C85B15]/30">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Spotlight Features
            </h3>
            <div className="size-9 rounded-lg bg-[#C85B15]/10 flex items-center justify-center text-[#C85B15]">
              <Sparkles className="size-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-['Anton'] text-[#C85B15]">
              {spotlightsCount.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Volunteer & Lecturer stories</span>
            <Link href="/admin/spotlights" className="text-[#C85B15] hover:underline font-semibold flex items-center gap-1">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Associations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#106333]/30">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Associations Tracked
            </h3>
            <div className="size-9 rounded-lg bg-[#106333]/10 flex items-center justify-center text-[#106333]">
              <Building2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-['Anton'] text-[#106333]">
              15
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">9 Departments • 6 Sub-Bodies</span>
            <Link href="/admin/associations" className="text-[#106333] hover:underline font-semibold flex items-center gap-1">
              Roster &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Admins */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-[#22203E]/30">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Active Admins
            </h3>
            <div className="size-9 rounded-lg bg-[#22203E]/10 flex items-center justify-center text-[#22203E]">
              <Users className="size-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-['Anton'] text-gray-900">
              {(activeAdmins + 1).toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Authorized executives</span>
            <Link href="/admin/users" className="text-[#170A51] hover:underline font-semibold flex items-center gap-1">
              Admins &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Section: Filterable, Paginated Recent Activity Feed */}
      <RecentActivityFeed activities={rawActivities} />
    </div>
  );
}
