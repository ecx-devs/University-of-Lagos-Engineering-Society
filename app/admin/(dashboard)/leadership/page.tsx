'use client';

import { useState, useEffect, useTransition, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  getAllExecutiveLeaders,
  createOrUpdateExecutiveLeader,
  deleteExecutiveLeader,
  reorderExecutiveLeaders,
  toggleExecutiveLeaderPublished,
  type ExecutiveLeaderData,
} from '@/app/actions/leadership';
import { getGlobalAcademicSession } from '@/app/actions/associations';
import { uploadToCloudinary } from '@/app/actions/upload';
import { compressImageFile } from '@/lib/image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Trash2,
  UploadCloud,
  Loader2,
  Edit,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Award,
  Phone,
  Mail,
  X,
  Plus,
} from 'lucide-react';

const leaderFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Office / Post Held is required'),
  department: z.string().min(2, 'Department is required'),
  phoneNumber: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  imageUrl: z.string().min(1, 'Leader portrait photo is required'),
  isPublished: z.boolean(),
});

type LeaderFormValues = z.infer<typeof leaderFormSchema>;

const INITIAL_FORM_VALUES: LeaderFormValues = {
  id: undefined,
  name: '',
  title: '',
  department: '',
  phoneNumber: '+234 ',
  email: '',
  imageUrl: '',
  isPublished: true,
};

export default function LeadershipAdminPage() {
  const [leaders, setLeaders] = useState<ExecutiveLeaderData[]>([]);
  const [academicSession, setAcademicSession] = useState('2026/2027');
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<LeaderFormValues>({
    resolver: zodResolver(leaderFormSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  const loadLeaders = async () => {
    try {
      setLoading(true);
      const [data, session] = await Promise.all([
        getAllExecutiveLeaders(),
        getGlobalAcademicSession(),
      ]);
      setLeaders(data);
      if (session) setAcademicSession(session);
    } catch (err: any) {
      console.error('Failed to load leaders:', err);
      setFeedback({ type: 'error', message: 'Failed to fetch executive leaders from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaders();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFeedback(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (leader: ExecutiveLeaderData) => {
    setEditingId(leader.id);
    form.reset({
      id: leader.id,
      name: leader.name,
      title: leader.title,
      department: leader.department,
      phoneNumber: leader.phoneNumber,
      email: leader.email,
      imageUrl: leader.imageUrl,
      isPublished: leader.isPublished,
    });
    setFeedback(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (values: LeaderFormValues) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await createOrUpdateExecutiveLeader({
        id: editingId || undefined,
        name: values.name,
        title: values.title,
        department: values.department,
        phoneNumber: values.phoneNumber,
        email: values.email,
        imageUrl: values.imageUrl,
        isPublished: values.isPublished,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: editingId
            ? `Successfully updated "${values.name}"!`
            : `Successfully added "${values.name}" as ${values.title}!`,
        });
        handleCloseModal();
        await loadLeaders();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to save leader profile.',
        });
      }
    });
  };

  const handleDelete = (leader: ExecutiveLeaderData) => {
    if (!confirm(`Are you sure you want to delete ${leader.name} (${leader.title})?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteExecutiveLeader(leader.id);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Deleted "${leader.name}" from executive leadership.`,
        });
        if (editingId === leader.id) handleCloseModal();
        await loadLeaders();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Failed to delete executive leader.',
        });
      }
    });
  };

  const handleTogglePublish = (leader: ExecutiveLeaderData) => {
    startTransition(async () => {
      const newStatus = !leader.isPublished;
      const res = await toggleExecutiveLeaderPublished(leader.id, newStatus);
      if (res.success) {
        setLeaders((prev) =>
          prev.map((l) => (l.id === leader.id ? { ...l, isPublished: newStatus } : l))
        );
        setFeedback({
          type: 'success',
          message: `Set "${leader.name}" to ${newStatus ? 'Published Live' : 'Hidden Draft'}.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update visibility.' });
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image file size must be less than 5MB.' });
      return;
    }

    setUploadingImage(true);
    setFeedback(null);

    try {
      const base64 = await compressImageFile(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      });

      const secureUrl = await uploadToCloudinary(base64, 'ules_leadership');
      form.setValue('imageUrl', secureUrl, { shouldValidate: true });
      setFeedback({ type: 'success', message: 'Photo uploaded successfully!' });
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: err.message || 'Image upload failed. Please try again.',
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= leaders.length) return;

    const reordered = [...leaders];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setLeaders(reordered);
    setReordering(true);

    try {
      const orderedIds = reordered.map((l) => l.id);
      const res = await reorderExecutiveLeaders(orderedIds);
      if (!res.success) {
        throw new Error(res.error);
      }
      setFeedback({
        type: 'success',
        message: `Updated display order: ${movedItem.name} moved ${direction}.`,
      });
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to persist order in database.' });
      await loadLeaders();
    } finally {
      setReordering(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const reordered = [...leaders];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    setLeaders(reordered);
    setDraggedIndex(null);
    setReordering(true);

    try {
      const orderedIds = reordered.map((l) => l.id);
      const res = await reorderExecutiveLeaders(orderedIds);
      if (!res.success) throw new Error(res.error);
      setFeedback({
        type: 'success',
        message: `Reordered: ${draggedItem.name} placed at position #${dropIndex + 1}.`,
      });
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to persist drag reorder.' });
      await loadLeaders();
    } finally {
      setReordering(false);
    }
  };

  const imageUrl = form.watch('imageUrl');

  const filteredLeaders = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return leaders;
    return leaders.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.department.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phoneNumber.includes(q)
    );
  }, [leaders, filterQuery]);

  const publishedCount = leaders.filter((l) => l.isPublished).length;

  return (
    <div className="space-y-6 font-['Neue_Machina']">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
              Executive Leadership
            </h1>
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">
              {academicSession}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl">
            Manage ULES Executive Council (EXCO) profiles, offices, contact details, photos, and
            custom display ordering.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Link
            href="/about-us"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-2xs"
          >
            <ExternalLink className="size-3.5" />
            <span>View Live</span>
          </Link>
          <Button
            onClick={handleOpenCreateModal}
            className="flex-1 sm:flex-none bg-[#170A51] hover:bg-[#22203E] text-white shadow-xs flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Executive Leader</span>
          </Button>
        </div>
      </div>

      {/* Global Toast / Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm">{feedback.message}</div>
          <button
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-700 text-sm"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Full Width Leaders List & Interactive Reordering Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-3.5 sm:p-4 border-b bg-gray-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by name, post, department..."
              className="pl-9 text-xs bg-white w-full shadow-2xs"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] text-gray-400 hidden lg:inline">
              Drag rows or use ▲ / ▼ to reorder positions
            </span>
            <span className="text-xs text-gray-600 font-medium">
              Showing <strong className="text-gray-900">{filteredLeaders.length}</strong> of{' '}
              <strong className="text-gray-900">{leaders.length}</strong> ({publishedCount} Live)
            </span>
          </div>
        </div>

        {/* Table or Loading / Empty States */}
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="size-8 animate-spin text-[#170A51] mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Loading leadership records...</p>
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-gray-400">
              <Award className="size-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">No leaders found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {filterQuery
                  ? `No records match "${filterQuery}". Try clearing search.`
                  : 'No executive council members in database. Click "Add Executive Leader" to add a profile.'}
              </p>
            </div>
            {filterQuery && (
              <Button variant="outline" size="sm" onClick={() => setFilterQuery('')}>
                Clear Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[840px] w-full">
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                  <TableHead className="w-16 text-center text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Order
                  </TableHead>
                  <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                    Leader
                  </TableHead>
                  <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                    Office / Role
                  </TableHead>
                  <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                    Department
                  </TableHead>
                  <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[160px]">
                    Contacts
                  </TableHead>
                  <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap text-center w-24">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap text-right pr-4 w-28">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaders.map((leader, index) => {
                  const isFirst = index === 0;
                  const isLast = index === filteredLeaders.length - 1;

                  return (
                    <TableRow
                      key={leader.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="transition-colors cursor-move group hover:bg-gray-50/80 border-b border-gray-100"
                    >
                      {/* Order index + Reorder Controls */}
                      <TableCell className="text-center py-3">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold group-hover:bg-[#170A51] group-hover:text-white transition-colors">
                            #{index + 1}
                          </span>

                          {/* Up / Down Reorder buttons */}
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveOrder(index, 'up');
                              }}
                              disabled={isFirst || isPending || reordering}
                              className="p-1 rounded text-gray-400 hover:text-gray-900 disabled:opacity-20 hover:bg-slate-200 transition-colors"
                              title="Move Up"
                              aria-label={`Move ${leader.name} up`}
                            >
                              <MoveUp className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveOrder(index, 'down');
                              }}
                              disabled={isLast || isPending || reordering}
                              className="p-1 rounded text-gray-400 hover:text-gray-900 disabled:opacity-20 hover:bg-slate-200 transition-colors"
                              title="Move Down"
                              aria-label={`Move ${leader.name} down`}
                            >
                              <MoveDown className="size-3" />
                            </button>
                          </div>
                        </div>
                      </TableCell>

                      {/* Leader Portrait & Name */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-slate-100">
                            <Image
                              src={leader.imageUrl || '/logo/logo-transparent.png'}
                              alt={leader.name}
                              fill
                              sizes="44px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {leader.name}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {leader.session || academicSession}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Office / Post Held */}
                      <TableCell className="py-3">
                        <span className="inline-block rounded-md bg-primary/10 text-primary font-semibold text-xs px-2.5 py-1">
                          {leader.title}
                        </span>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="py-3">
                        <p className="text-xs text-gray-600 truncate max-w-[200px]" title={leader.department}>
                          {leader.department}
                        </p>
                      </TableCell>

                      {/* Contacts */}
                      <TableCell className="py-3">
                        <div className="space-y-1 text-[11px] text-gray-500">
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="size-3 text-gray-400 shrink-0" />
                            <span>{leader.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="size-3 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[180px]" title={leader.email}>
                              {leader.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Published Status */}
                      <TableCell className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(leader)}
                          disabled={isPending}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            leader.isPublished
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {leader.isPublished ? (
                            <>
                              <Eye className="size-3" />
                              Live
                            </>
                          ) : (
                            <>
                              <EyeOff className="size-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </TableCell>

                      {/* Actions (Edit & Delete) */}
                      <TableCell className="py-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(leader)}
                            className="size-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/10"
                            title="Edit Leader"
                          >
                            <Edit className="size-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(leader)}
                            className="size-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Leader"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-6 py-4">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <h2 className="text-xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
                  {editingId ? 'Edit Leader Profile' : 'Add New Executive Leader'}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Full Name & Office/Post Held */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...form.register('name')}
                    placeholder="e.g. Halimat Ozemoka"
                    className="text-sm bg-white"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Office / Post Held (Title) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...form.register('title')}
                    placeholder="e.g. Social Secretary, President"
                    className="text-sm bg-white"
                  />
                  {form.formState.errors.title && (
                    <p className="text-xs text-red-600 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <Input
                  {...form.register('department')}
                  placeholder="e.g. Systems Engineering"
                  className="text-sm bg-white"
                />
                {form.formState.errors.department && (
                  <p className="text-xs text-red-600 mt-1">
                    {form.formState.errors.department.message}
                  </p>
                )}
              </div>

              {/* Email & Phone Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="leader@gmail.com"
                    className="text-sm bg-white"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...form.register('phoneNumber')}
                    placeholder="+234 812 345 6789"
                    className="text-sm bg-white"
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Official Portrait Photo Upload */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Official Portrait Photo <span className="text-red-500">*</span>
                </label>

                {imageUrl ? (
                  <div className="relative aspect-4/5 w-32 mx-auto rounded-xl overflow-hidden border-2 border-primary/40 group shadow-sm bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt="Leader preview"
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded bg-white text-gray-900 text-xs font-semibold hover:bg-gray-100 shadow-xs"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue('imageUrl', '', { shouldValidate: true })}
                        className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 ${
                      uploadingImage ? 'pointer-events-none opacity-60' : ''
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="size-8 animate-spin text-primary mb-2" />
                        <p className="text-xs font-semibold text-gray-700">
                          Uploading image...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2">
                        <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <UploadCloud className="size-5" />
                        </div>
                        <p className="text-xs font-semibold text-gray-800">
                          Click or drag portrait photo
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          PNG, JPG, WebP up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-xs text-red-600 mt-1">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>

              {/* Is Published Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="leaderIsPublished"
                  type="checkbox"
                  {...form.register('isPublished')}
                  className="size-4 rounded border-gray-300 text-[#170A51] focus:ring-[#170A51]"
                />
                <label htmlFor="leaderIsPublished" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Publish live immediately on executive leadership page
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isPending || uploadingImage}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || uploadingImage}
                  className="bg-[#170A51] hover:bg-[#22203E] text-white font-semibold text-xs py-2 px-4"
                >
                  {isPending && <Loader2 className="size-4 animate-spin mr-2" />}
                  {editingId ? 'Update Leader Profile' : 'Save Leader'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
