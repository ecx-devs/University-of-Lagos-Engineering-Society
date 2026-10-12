'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import {
  getAssociationLeadersData,
  updateAssociationLeader,
  saveAllAssociationLeaders,
  updateGlobalAcademicSession,
  type LeaderRecord,
} from '@/app/actions/associations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Calendar,
  Save,
  Check,
  Search,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAssociationsPage() {
  const [leaders, setLeaders] = useState<LeaderRecord[]>([]);
  const [session, setSession] = useState<string>('2026/2027');
  const [initialSession, setInitialSession] = useState<string>('2026/2027');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'departmental' | 'sub-bodies'>('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isBulkSaving, startBulkTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAssociationLeadersData();
      setLeaders(data.leaders);
      setSession(data.session);
      setInitialSession(data.session);
    } catch (err) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: 'Failed to load associations from database.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderChange = (slug: string, field: 'name' | 'title', val: string) => {
    setLeaders((prev) =>
      prev.map((item) => (item.slug === slug ? { ...item, [field]: val } : item))
    );
  };

  const handleSaveSingle = async (item: LeaderRecord) => {
    setSavingId(item.slug);
    setFeedbackMsg(null);
    try {
      const res = await updateAssociationLeader({
        slug: item.slug,
        name: item.name,
        title: item.title,
        session: session,
      });

      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `Successfully updated leadership for ${item.bodyName}!`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save leader.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSavingId(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleSaveAll = () => {
    setFeedbackMsg(null);
    startBulkTransition(async () => {
      try {
        const payload = {
          session,
          leaders: leaders.map((l) => ({ slug: l.slug, name: l.name, title: l.title })),
        };
        const res = await saveAllAssociationLeaders(payload);
        if (res.success) {
          setInitialSession(session);
          setFeedbackMsg({
            type: 'success',
            text: 'All association leaders and academic session saved successfully!',
          });
        } else {
          setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save all changes.' });
        }
      } catch (err: any) {
        setFeedbackMsg({ type: 'error', text: err.message || 'Error saving all leaders.' });
      } finally {
        setTimeout(() => setFeedbackMsg(null), 5000);
      }
    });
  };

  const handleUpdateSessionOnly = async () => {
    if (session === initialSession) return;
    setSavingId('session-only');
    try {
      const res = await updateGlobalAcademicSession(session);
      if (res.success) {
        setInitialSession(session);
        setFeedbackMsg({
          type: 'success',
          text: `Global academic session updated to ${session}! All public pages synchronized.`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update session.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to update session.' });
    } finally {
      setSavingId(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const filteredLeaders = leaders.filter((l) => {
    const matchesSearch =
      l.bodyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.name.toLowerCase().includes(searchTerm.toLowerCase());

    const isDept = ['ases', 'bmesa', 'cess', 'nammes', 'nimeche', 'nisgs', 'nsche', 'sees', 'spe'].includes(
      l.slug
    );
    const matchesType =
      filterType === 'all' ||
      (filterType === 'departmental' && isDept) ||
      (filterType === 'sub-bodies' && !isDept);

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
            Associations & Leadership
          </h1>
          <p className="text-gray-500 font-['Neue_Machina'] text-sm mt-1">
            Manage the current president/leads and active academic session across all 15 departmental bodies and sub-bodies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 border-gray-300"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={handleSaveAll}
            disabled={isBulkSaving || loading}
            className="bg-[#106333] hover:bg-[#0c4b26] text-white flex items-center gap-2 shadow-xs"
          >
            {isBulkSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving All...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Notification Banner */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <Check className="size-5 shrink-0 text-emerald-600" />
          ) : (
            <ShieldCheck className="size-5 shrink-0 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Section 1: Global Academic Session Controller */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Active Academic Session
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Updating this session value propagates automatically across the entire platform — including the
              Home Welcome Message, Executive Council, and all 15 association profile cards and badges.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="relative">
              <Calendar className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="e.g. 2026/2027"
                className="pl-9 w-40 font-semibold text-gray-900 border-gray-300"
              />
            </div>

            <Button
              type="button"
              onClick={handleUpdateSessionOnly}
              disabled={savingId === 'session-only' || session === initialSession}
              className="bg-[#C85B15] hover:bg-[#a84c11] text-white"
            >
              {savingId === 'session-only' ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Updating...
                </>
              ) : (
                'Update Session'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: Search, Filters & Associations Roster */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Filters and Search Toolbar */}
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#170A51] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Associations (15)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('departmental')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'departmental'
                  ? 'bg-[#106333] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Departments (9)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('sub-bodies')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === 'sub-bodies'
                  ? 'bg-[#C85B15] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Sub-Bodies (6)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by body or lead name..."
              className="pl-9 bg-white border-gray-300 text-sm"
            />
          </div>
        </div>

        {/* Association Leaders Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="size-8 animate-spin text-[#106333]" />
            <p className="text-sm font-medium">Loading leadership records from database...</p>
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Building2 className="size-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No matching associations found</p>
            <p className="text-sm mt-0.5">Try clearing your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  <th className="py-3.5 px-4 sm:px-6">Association</th>
                  <th className="py-3.5 px-4">Leadership Role / Title</th>
                  <th className="py-3.5 px-4">Current Lead Name</th>
                  <th className="py-3.5 px-4 text-center">Session</th>
                  <th className="py-3.5 px-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredLeaders.map((item) => (
                  <tr key={item.slug} className="hover:bg-gray-50/60 transition-colors">
                    {/* Association Info */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="size-11 shrink-0 rounded-lg border border-gray-200 bg-white p-1 flex items-center justify-center">
                          <Image
                            src={item.imageSrc}
                            alt=""
                            width={36}
                            height={36}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900">{item.bodyName}</span>
                            <Link
                              href={`/associations/${item.slug}`}
                              target="_blank"
                              className="text-gray-400 hover:text-primary transition-colors"
                              title="View public live profile"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                          <span className="inline-block text-xs text-gray-500">
                            {item.acronym} • {item.typeLabel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Executive Title */}
                    <td className="py-4 px-4 min-w-[180px]">
                      <Input
                        value={item.title}
                        onChange={(e) => handleLeaderChange(item.slug, 'title', e.target.value)}
                        placeholder="e.g. President"
                        className="h-9 text-xs sm:text-sm border-gray-300 font-medium"
                      />
                    </td>

                    {/* Leader Name */}
                    <td className="py-4 px-4 min-w-[220px]">
                      <Input
                        value={item.name}
                        onChange={(e) => handleLeaderChange(item.slug, 'name', e.target.value)}
                        placeholder="Leader Full Name"
                        className="h-9 text-xs sm:text-sm border-gray-300 font-semibold text-gray-900"
                      />
                    </td>

                    {/* Active Session */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">
                        {session}
                      </span>
                    </td>

                    {/* Save Action */}
                    <td className="py-4 px-4 text-right pr-6">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveSingle(item)}
                        disabled={savingId === item.slug || isBulkSaving}
                        className="bg-[#106333] hover:bg-[#0c4b26] text-white h-9 px-3.5"
                      >
                        {savingId === item.slug ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <>
                            <Save className="size-3.5 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
