'use client';

import { useState, useMemo, useTransition } from 'react';
import { formatDistanceToNow, isAfter, subDays, startOfDay } from 'date-fns';
import {
  Eye,
  Trash2,
  Search,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Mail,
  CircleCheck,
  CircleAlert,
  CircleHelp,
  Lightbulb,
  CheckCheck,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  deleteFeedback,
  toggleFeedbackRead,
  markAllFeedbacksRead,
  generateFeedbackSummary,
  type FeedbackSummaryResult,
} from '@/app/actions/feedback';
import {
  analyzeFeedbackItem,
  aggregateFeedbacksSummary,
  type SentimentCategory,
  type TopicCategory,
} from '@/lib/sentiment';

export interface SubmissionItem {
  id: string;
  name: string | null;
  email: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const ITEMS_PER_PAGE = 8;

function formatDistanceSafe(dateStr: string | Date | undefined | null): string {
  try {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'Recently';
  }
}

const SUMMARY_TOPIC_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All Topics', value: 'all' },
  { label: 'Academics & Faculty', value: 'Academics & Faculty' },
  { label: 'Facilities & Classrooms', value: 'Facilities & Classrooms' },
  { label: 'Welfare & Dues', value: 'Welfare & Dues' },
  { label: 'Events & Competitions', value: 'Events & Competitions' },
  { label: 'Platform & Website', value: 'Platform & Website' },
];

export default function SubmissionsClientTable({
  feedbacks: initialFeedbacks = [],
}: {
  feedbacks: SubmissionItem[];
}) {
  const [feedbacks, setFeedbacks] = useState<SubmissionItem[]>(initialFeedbacks || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | SentimentCategory>('all');
  const [topicFilter, setTopicFilter] = useState<'all' | TopicCategory>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewFeedbackId, setViewFeedbackId] = useState<string | null>(null);

  // Summary State
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryReport, setSummaryReport] = useState<FeedbackSummaryResult | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryCategoryFilter, setSummaryCategoryFilter] = useState('all');
  const [isPending, startTransition] = useTransition();

  // Pre-analyze feedbacks with local sentiment engine
  const analyzedFeedbacks = useMemo(() => {
    return (feedbacks || []).map((fb) => {
      const createdDate = new Date(fb.createdAt || Date.now());
      const validDate = isNaN(createdDate.getTime()) ? new Date() : createdDate;
      return {
        ...fb,
        analysis: analyzeFeedbackItem(fb.subject || '', fb.message || ''),
        createdDate: validDate,
      };
    });
  }, [feedbacks]);

  // Aggregate high-level stats
  const overallSummary = useMemo(() => {
    return aggregateFeedbacksSummary(feedbacks || []);
  }, [feedbacks]);

  // Filtered & Sorted Feedbacks
  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const now = new Date();

    return analyzedFeedbacks
      .filter((fb) => {
        // Search filter
        if (query) {
          const nameMatch = (fb.name || '').toLowerCase().includes(query);
          const emailMatch = (fb.email || '').toLowerCase().includes(query);
          const subjectMatch = (fb.subject || '').toLowerCase().includes(query);
          const messageMatch = (fb.message || '').toLowerCase().includes(query);
          if (!nameMatch && !emailMatch && !subjectMatch && !messageMatch) {
            return false;
          }
        }

        // Read status filter
        if (readFilter === 'unread' && fb.read) return false;
        if (readFilter === 'read' && !fb.read) return false;

        // Sentiment filter
        if (sentimentFilter !== 'all' && fb.analysis.sentiment !== sentimentFilter) {
          return false;
        }

        // Topic filter
        if (topicFilter !== 'all' && fb.analysis.topic !== topicFilter) {
          return false;
        }

        // Date filter
        if (dateFilter === 'today') {
          if (!isAfter(fb.createdDate, startOfDay(now))) return false;
        } else if (dateFilter === '7days') {
          if (!isAfter(fb.createdDate, subDays(now, 7))) return false;
        } else if (dateFilter === '30days') {
          if (!isAfter(fb.createdDate, subDays(now, 30))) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return b.createdDate.getTime() - a.createdDate.getTime();
        }
        return a.createdDate.getTime() - b.createdDate.getTime();
      });
  }, [analyzedFeedbacks, searchQuery, readFilter, sentimentFilter, topicFilter, dateFilter, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE));
  const paginatedFeedbacks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFeedbacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFeedbacks, currentPage]);

  const activeFeedback = useMemo(() => {
    return analyzedFeedbacks.find((fb) => fb.id === viewFeedbackId);
  }, [analyzedFeedbacks, viewFeedbackId]);

  // Automatically mark message as read upon opening
  const handleOpenView = async (fb: SubmissionItem) => {
    setViewFeedbackId(fb.id);
    if (!fb.read) {
      setFeedbacks((prev) =>
        prev.map((item) => (item.id === fb.id ? { ...item, read: true } : item))
      );
      try {
        await toggleFeedbackRead(fb.id, true);
      } catch (e) {
        console.error('Error marking as read:', e);
      }
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, read: nextRead } : fb))
    );
    try {
      await toggleFeedbackRead(id, nextRead);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = () => {
    if (!confirm('Mark all submissions as read?')) return;
    setFeedbacks((prev) => prev.map((fb) => ({ ...fb, read: true })));
    startTransition(async () => {
      await markAllFeedbacksRead();
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this submission?')) {
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
      if (viewFeedbackId === id) setViewFeedbackId(null);
      await deleteFeedback(id);
    }
  };

  const fetchFeedbackSummary = async (topic: string = 'all') => {
    setIsSummaryLoading(true);
    setSummaryCategoryFilter(topic);
    setShowSummaryModal(true);
    try {
      const result = await generateFeedbackSummary(topic);
      setSummaryReport(result);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: SentimentCategory) => {
    switch (sentiment) {
      case 'positive':
        return <CircleCheck className="size-3.5 text-emerald-600" />;
      case 'suggestion':
        return <Lightbulb className="size-3.5 text-amber-600" />;
      case 'urgent':
        return <CircleAlert className="size-3.5 text-red-600" />;
      default:
        return <CircleHelp className="size-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-5 font-['Neue_Machina']">
      {/* SECTION 1: SENTIMENT SPECTRUM & FEEDBACK SUMMARY BAR */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Sentiment Label & Distribution */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <TrendingUp className="size-4 text-[#106333]" />
            <span>Sentiment Spectrum</span>
            <span className="text-gray-400 font-normal ml-1">
              {overallSummary.total > 0
                ? `${overallSummary.positivePct}% Positive • ${overallSummary.suggestionPct}% Suggestions • ${overallSummary.urgentPct}% Urgent`
                : 'Awaiting student submissions'}
            </span>
          </div>

          <Button
            onClick={() => fetchFeedbackSummary('all')}
            className="w-full sm:w-auto justify-center bg-[#170A51] hover:bg-[#22203E] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            Feedback Summary
          </Button>
        </div>

        {/* Multi-segment Colored Bar */}
        <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
          {overallSummary.total > 0 ? (
            <>
              <div
                style={{ width: `${overallSummary.positivePct}%` }}
                className="bg-[#106333] transition-all duration-500 cursor-pointer"
                title={`Positive: ${overallSummary.positiveCount} (${overallSummary.positivePct}%)`}
                onClick={() => setSentimentFilter(sentimentFilter === 'positive' ? 'all' : 'positive')}
              />
              <div
                style={{ width: `${overallSummary.suggestionPct}%` }}
                className="bg-[#C85B15] transition-all duration-500 cursor-pointer"
                title={`Suggestions: ${overallSummary.suggestionCount} (${overallSummary.suggestionPct}%)`}
                onClick={() => setSentimentFilter(sentimentFilter === 'suggestion' ? 'all' : 'suggestion')}
              />
              <div
                style={{ width: `${overallSummary.urgentPct}%` }}
                className="bg-red-500 transition-all duration-500 cursor-pointer"
                title={`Urgent Issues: ${overallSummary.urgentCount} (${overallSummary.urgentPct}%)`}
                onClick={() => setSentimentFilter(sentimentFilter === 'urgent' ? 'all' : 'urgent')}
              />
              <div
                style={{ width: `${overallSummary.neutralPct}%` }}
                className="bg-gray-300 transition-all duration-500 cursor-pointer"
                title={`General: ${overallSummary.neutralCount} (${overallSummary.neutralPct}%)`}
                onClick={() => setSentimentFilter(sentimentFilter === 'neutral' ? 'all' : 'neutral')}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
              No submissions recorded yet
            </div>
          )}
        </div>

        {/* Sentiment Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div
            onClick={() => setSentimentFilter(sentimentFilter === 'positive' ? 'all' : 'positive')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              sentimentFilter === 'positive'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="size-2 rounded-full bg-[#106333]" />
            <span>Positive ({overallSummary.positiveCount})</span>
          </div>

          <div
            onClick={() => setSentimentFilter(sentimentFilter === 'suggestion' ? 'all' : 'suggestion')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              sentimentFilter === 'suggestion'
                ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold shadow-2xs'
                : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="size-2 rounded-full bg-[#C85B15]" />
            <span>Suggestions ({overallSummary.suggestionCount})</span>
          </div>

          <div
            onClick={() => setSentimentFilter(sentimentFilter === 'urgent' ? 'all' : 'urgent')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              sentimentFilter === 'urgent'
                ? 'border-red-500 bg-red-50 text-red-900 font-semibold shadow-2xs'
                : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="size-2 rounded-full bg-red-500" />
            <span>Urgent ({overallSummary.urgentCount})</span>
          </div>

          <div
            onClick={() => setSentimentFilter(sentimentFilter === 'neutral' ? 'all' : 'neutral')}
            className={`px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              sentimentFilter === 'neutral'
                ? 'border-gray-400 bg-gray-200 text-gray-900 font-semibold shadow-2xs'
                : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="size-2 rounded-full bg-gray-400" />
            <span>General ({overallSummary.neutralCount})</span>
          </div>
        </div>

        {/* Recurring Topic Pills (Auto-classified from message keywords) */}
        {overallSummary.topTopics.length > 0 && (
          <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-gray-400 text-[11px] font-medium mr-1">Recurring Topics:</span>
            {overallSummary.topTopics.map((item) => (
              <button
                key={item.topic}
                onClick={() => {
                  setTopicFilter(topicFilter === item.topic ? 'all' : item.topic);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] transition-colors cursor-pointer border ${
                  topicFilter === item.topic
                    ? 'bg-[#170A51] text-white border-[#170A51] font-semibold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{item.topic}</span>
                <span className={topicFilter === item.topic ? 'text-amber-300' : 'text-gray-500'}>
                  ({item.count})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: SEARCH, FILTER, AND CONTROLS TOOLBAR */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="size-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by student name, email, subject, or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9.5 text-xs bg-gray-50/50 border-gray-200 focus:bg-white w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick Mark All Read & Clear Filters */}
          <div className="flex items-center gap-2 justify-between md:justify-end shrink-0">
            {(searchQuery ||
              readFilter !== 'all' ||
              sentimentFilter !== 'all' ||
              topicFilter !== 'all' ||
              dateFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setReadFilter('all');
                  setSentimentFilter('all');
                  setTopicFilter('all');
                  setDateFilter('all');
                  setCurrentPage(1);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Clear Filters
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={isPending || feedbacks.length === 0}
              onClick={handleMarkAllRead}
              className="text-xs text-gray-700 border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <CheckCheck className="size-3.5 text-[#106333]" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-2 border-t border-gray-100">
          <span className="text-gray-400 flex items-center gap-1 mr-1">
            <Filter className="size-3" />
            Filter by:
          </span>

          {/* Read Status */}
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50/80">
            <button
              onClick={() => {
                setReadFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                readFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({feedbacks.length})
            </button>
            <button
              onClick={() => {
                setReadFilter('unread');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                readFilter === 'unread' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Unread ({feedbacks.filter((f) => !f.read).length})
            </button>
            <button
              onClick={() => {
                setReadFilter('read');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                readFilter === 'read' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Read ({feedbacks.filter((f) => f.read).length})
            </button>
          </div>

          {/* Date Filter */}
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50/80">
            <button
              onClick={() => {
                setDateFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                dateFilter === 'all' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => {
                setDateFilter('today');
                setCurrentPage(1);
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                dateFilter === 'today' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setDateFilter('7days');
                setCurrentPage(1);
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                dateFilter === '7days' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => {
                setDateFilter('30days');
                setCurrentPage(1);
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                dateFilter === '30days' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="w-full sm:w-auto sm:ml-auto text-xs text-gray-600 hover:text-gray-900 px-2.5 py-1 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer text-center sm:text-right"
          >
            Sort: <strong>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</strong>
          </button>
        </div>
      </div>

      {/* SECTION 3: SUBMISSIONS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[760px] divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50/90 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 sm:px-6 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
                  Status & Date
                </th>
                <th className="px-4 py-3.5 sm:px-6 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
                  Student
                </th>
                <th className="px-4 py-3.5 sm:px-6 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[220px]">
                  Subject & Excerpt
                </th>
                <th className="px-4 py-3.5 sm:px-6 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                  Category
                </th>
                <th className="px-4 py-3.5 sm:px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
                      <MessageSquare className="size-6" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {feedbacks.length === 0
                        ? 'No student submissions recorded yet'
                        : 'No submissions match your filters'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      {feedbacks.length === 0
                        ? 'Submissions sent from the public website feedback form will appear here.'
                        : 'Try clearing the search query or adjusting your filters.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedFeedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    className={`transition-colors hover:bg-gray-50/80 ${
                      !fb.read ? 'bg-blue-50/25' : ''
                    }`}
                  >
                    {/* Status & Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(fb.id, fb.read)}
                          title={fb.read ? 'Mark as Unread' : 'Mark as Read'}
                          className={`size-2.5 rounded-full transition-transform hover:scale-125 cursor-pointer ${
                            fb.read ? 'bg-gray-300' : 'bg-blue-600 ring-4 ring-blue-100'
                          }`}
                        />
                        <span className="text-gray-500">
                          {formatDistanceSafe(fb.createdDate)}
                        </span>
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="px-6 py-4 text-xs font-medium text-gray-900">
                      <div>{fb.name || 'Anonymous Student'}</div>
                      <div className="text-gray-400 font-normal truncate max-w-[180px]">
                        {fb.email || 'No email provided'}
                      </div>
                    </td>

                    {/* Subject & Excerpt */}
                    <td className="px-6 py-4 text-xs max-w-xs">
                      <div
                        onClick={() => handleOpenView(fb)}
                        className="font-semibold text-[#170A51] hover:text-[#C85B15] cursor-pointer truncate"
                      >
                        {fb.subject}
                      </div>
                      <div className="text-gray-500 truncate mt-0.5 text-[11px]">
                        {fb.message}
                      </div>
                    </td>

                    {/* Topic & Sentiment Badge */}
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${fb.analysis.badgeBg} ${fb.analysis.badgeText}`}
                        >
                          {getSentimentIcon(fb.analysis.sentiment)}
                          {fb.analysis.sentimentLabel}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {fb.analysis.topic}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-xs text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenView(fb)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View message (marks as read)"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Submission"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: PAGINATION CONTROLS */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-gray-500">
            Showing{' '}
            <strong className="text-gray-900">
              {filteredFeedbacks.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-gray-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredFeedbacks.length)}
            </strong>{' '}
            of <strong className="text-gray-900">{filteredFeedbacks.length}</strong> submissions
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs text-gray-600 border-gray-300 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="size-3.5 mr-1" />
              Previous
            </Button>

            <span className="px-3 text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 text-xs text-gray-600 border-gray-300 disabled:opacity-40 cursor-pointer"
            >
              Next
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL 1: VIEW SUBMISSION DETAILS */}
      <Dialog
        open={Boolean(viewFeedbackId)}
        onOpenChange={(open: boolean) => {
          if (!open) setViewFeedbackId(null);
        }}
      >
        <DialogContent showCloseButton className="max-w-2xl font-['Neue_Machina']">
          <DialogTitle className="text-2xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
            Feedback Submission
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Submitted on{' '}
            {activeFeedback ? new Date(activeFeedback.createdAt).toLocaleString() : ''}
          </DialogDescription>

          {activeFeedback && (
            <div className="space-y-4 mt-2 text-xs">
              {/* Metadata Box */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-gray-400">Student:</span>{' '}
                    <strong className="text-gray-900">{activeFeedback.name || 'Anonymous Student'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>{' '}
                    <strong className="text-gray-900">{activeFeedback.email || 'None Provided'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${activeFeedback.analysis.badgeBg} ${activeFeedback.analysis.badgeText}`}
                  >
                    {getSentimentIcon(activeFeedback.analysis.sentiment)}
                    {activeFeedback.analysis.sentimentLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-[10px] font-medium">
                    Category: {activeFeedback.analysis.topic}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Subject</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{activeFeedback.subject}</p>
              </div>

              {/* Message Content */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 min-h-[140px] whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                {activeFeedback.message}
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRead(activeFeedback.id, activeFeedback.read)}
                    className="text-xs cursor-pointer"
                  >
                    {activeFeedback.read ? 'Mark as Unread' : 'Mark as Read'}
                  </Button>

                  {/* Reply via email link */}
                  {activeFeedback.email && (
                    <a
                      href={`mailto:${activeFeedback.email}?subject=Re:%20${encodeURIComponent(
                        activeFeedback.subject
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#170A51] text-white text-xs font-semibold hover:bg-[#22203E] transition-colors"
                      title="Opens your mail client with pre-filled address and subject"
                    >
                      <Mail className="size-3.5" />
                      Reply to Student
                    </a>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(activeFeedback.id)}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSummaryModal}
        onOpenChange={(open: boolean) => setShowSummaryModal(open)}
      >
        <DialogContent showCloseButton className="max-w-3xl font-['Neue_Machina']">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#170A51] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="size-4.5 text-amber-300" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
                Feedback Summary
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Synthesis across student feedback submissions.
              </DialogDescription>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 flex-wrap text-xs border-b border-gray-100 pb-3">
            <span className="text-gray-400 text-[11px] font-medium mr-1">Filter Summary:</span>
            {SUMMARY_TOPIC_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => fetchFeedbackSummary(opt.value)}
                disabled={isSummaryLoading}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                  summaryCategoryFilter === opt.value
                    ? 'bg-[#170A51] text-white border-[#170A51] font-semibold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {isSummaryLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="size-8 text-[#C85B15] animate-spin mx-auto" />
              <p className="font-semibold text-gray-800 text-sm">
                Generating summary for {summaryCategoryFilter === 'all' ? 'all submissions' : summaryCategoryFilter}...
              </p>
            </div>
          ) : summaryReport ? (
            <div className="space-y-4 mt-2 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#170A51] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    Overview
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{summaryReport.summaryText}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-['Anton'] text-base text-[#170A51] tracking-wide uppercase flex items-center gap-2">
                  <CircleAlert className="size-4 text-red-500" />
                  Key Student Pain Points & Friction
                </h4>
                <div className="space-y-1.5">
                  {summaryReport.keyIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50/50 rounded-lg border border-red-100 text-gray-800 flex items-start gap-2.5"
                    >
                      <span className="size-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commendations */}
              {summaryReport.commendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-['Anton'] text-base text-[#170A51] tracking-wide uppercase flex items-center gap-2">
                    <CircleCheck className="size-4 text-[#106333]" />
                    Commendations & Positive Notes
                  </h4>
                  <div className="space-y-1.5">
                    {summaryReport.commendations.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-gray-800 flex items-start gap-2.5"
                      >
                        <span className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
                          ✓
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Steps */}
              <div className="space-y-2">
                <h4 className="font-['Anton'] text-base text-[#170A51] tracking-wide uppercase flex items-center gap-2">
                  <Lightbulb className="size-4 text-[#C85B15]" />
                  Recommended Actions for ULES Council
                </h4>
                <div className="space-y-1.5">
                  {summaryReport.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-gray-800 flex items-start gap-2.5"
                    >
                      <span className="size-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0 text-[11px]">
                        &rarr;
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
