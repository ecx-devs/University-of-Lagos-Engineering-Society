'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, isAfter, subDays, startOfDay } from 'date-fns';
import {
  Inbox,
  Sparkles,
  Building2,
  Calendar,
  Shield,
  MessageSquare,
  ArrowRight,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Newspaper,
  BookOpen,
  Award,
} from 'lucide-react';

export interface SerializableActivityItem {
  id: string;
  type: 'feedback' | 'spotlight' | 'association' | 'setting' | 'admin' | 'news' | 'blog' | 'leadership';
  title: string;
  description: string;
  timestamp: string; // ISO string
  link: string;
  badge: {
    text: string;
    className: string;
  };
  iconType: 'feedback' | 'spotlight' | 'association' | 'setting' | 'admin' | 'news' | 'blog' | 'leadership';
  iconBg: string;
  iconColor: string;
}

const ITEMS_PER_PAGE = 6;

export default function RecentActivityFeed({
  activities: initialActivities,
  isSuperAdmin = false,
}: {
  activities: SerializableActivityItem[];
  isSuperAdmin?: boolean;
}) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'feedback' | 'spotlight' | 'association' | 'setting' | 'admin' | 'news' | 'blog' | 'leadership'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Parse and filter activities
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const q = searchQuery.toLowerCase().trim();

    return initialActivities
      .filter((item) => {
        const itemDate = new Date(item.timestamp);

        // Search query
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchBadge = item.badge.text.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBadge) return false;
        }

        // Type filter
        if (typeFilter !== 'all' && item.type !== typeFilter) {
          return false;
        }

        // Date filter
        if (dateFilter === 'today') {
          if (!isAfter(itemDate, startOfDay(now))) return false;
        } else if (dateFilter === '7days') {
          if (!isAfter(itemDate, subDays(now, 7))) return false;
        } else if (dateFilter === '30days') {
          if (!isAfter(itemDate, subDays(now, 30))) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [initialActivities, typeFilter, dateFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE));
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActivities, currentPage]);

  const renderIcon = (type: SerializableActivityItem['iconType']) => {
    switch (type) {
      case 'feedback':
        return <MessageSquare className="size-5" />;
      case 'spotlight':
        return <Sparkles className="size-5" />;
      case 'association':
        return <Building2 className="size-5" />;
      case 'setting':
        return <Calendar className="size-5" />;
      case 'admin':
        return <Shield className="size-5" />;
      case 'news':
        return <Newspaper className="size-5" />;
      case 'blog':
        return <BookOpen className="size-5" />;
      case 'leadership':
        return <Award className="size-5" />;
      default:
        return <Clock className="size-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs font-['Neue_Machina']">
      {/* Header with Live Sync Pulse */}
      <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-['Anton'] text-[#170A51] tracking-wide uppercase">
            Recent Activity Feed
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            Total logged: <strong className="text-gray-900">{initialActivities.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/30 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="size-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter activities by keyword, department, or student..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#170A51]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {(searchQuery || typeFilter !== 'all' || dateFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDateFilter('all');
                setCurrentPage(1);
              }}
              className="text-xs text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Badges Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs pt-1 border-t border-gray-200/60">
          <span className="text-gray-400 flex items-center gap-1 text-[11px] shrink-0">
            <Filter className="size-3" /> Filters:
          </span>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full no-scrollbar">
            {/* Date Filter Pills */}
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-white shrink-0">
              <button
                onClick={() => {
                  setDateFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  dateFilter === 'all'
                    ? 'bg-[#170A51] text-white font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Time
              </button>
            <button
              onClick={() => {
                setDateFilter('today');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                dateFilter === 'today'
                  ? 'bg-[#170A51] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setDateFilter('7days');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                dateFilter === '7days'
                  ? 'bg-[#170A51] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => {
                setDateFilter('30days');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                dateFilter === '30days'
                  ? 'bg-[#170A51] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past 30 Days
            </button>
          </div>

          {/* Type Filter Pills */}
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-white">
            <button
              onClick={() => {
                setTypeFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-gray-800 text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => {
                setTypeFilter('feedback');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'feedback'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => {
                setTypeFilter('spotlight');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'spotlight'
                  ? 'bg-[#C85B15] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Spotlights
            </button>
            <button
              onClick={() => {
                setTypeFilter('association');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'association'
                  ? 'bg-[#106333] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Associations
            </button>
            <button
              onClick={() => {
                setTypeFilter('news');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'news'
                  ? 'bg-[#170A51] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              News
            </button>
            <button
              onClick={() => {
                setTypeFilter('blog');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'blog'
                  ? 'bg-[#C85B15] text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => {
                setTypeFilter('leadership');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                typeFilter === 'leadership'
                  ? 'bg-purple-700 text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leadership
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setTypeFilter('admin');
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  typeFilter === 'admin'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admins
              </button>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {paginatedActivities.length === 0 ? (
        <div className="p-16 text-center text-gray-500 space-y-3">
          <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-base">No activities match your filters</p>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Try adjusting the date range or selecting a different category to view older platform logs.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {paginatedActivities.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                <div
                  className={`size-10 shrink-0 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mt-0.5 sm:mt-0`}
                >
                  {renderIcon(item.iconType)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-[#C85B15] transition-colors truncate">
                      {item.title}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${item.badge.className}`}
                    >
                      {item.badge.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </span>
                <ArrowRight className="size-4 text-gray-300 group-hover:text-[#C85B15] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Showing{' '}
          <strong className="text-gray-900">
            {filteredActivities.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          </strong>{' '}
          to{' '}
          <strong className="text-gray-900">
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)}
          </strong>{' '}
          of <strong className="text-gray-900">{filteredActivities.length}</strong> activities
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50 flex items-center gap-1"
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </button>

          <span className="px-2 font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50 flex items-center gap-1"
          >
            Next
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
