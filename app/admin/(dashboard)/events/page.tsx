'use client';

import { useState, useEffect, useTransition, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import {
  getEvents,
  createOrUpdateEvent,
  deleteEvent,
  addGalleryImages,
  deleteGalleryImage,
} from '@/app/actions/events';
import { slugify } from '@/lib/utils';
import { uploadToCloudinary } from '@/app/actions/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  slug: z.string().optional(),
  frequency: z.string().min(1, 'Frequency is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  venue: z.string().min(1, 'Venue is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImageUrl: z.string().min(1, 'Cover image is required'),
});

type FormValues = z.infer<typeof formSchema>;

const FREQUENCY_OPTIONS = [
  'Annual Event',
  'One-off',
  'Biennial Event',
  'Monthly Series',
  'Semester Programme',
];

const ITEMS_PER_PAGE = 8;

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'gallery'>('details');

  // Cover Image upload state
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Gallery Multi-upload state
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past' | 'gallery'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Status message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      title: '',
      slug: '',
      frequency: 'Annual Event',
      date: new Date().toISOString().split('T')[0],
      time: '',
      venue: '',
      description: '',
      coverImageUrl: '',
    },
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    form.reset({
      id: undefined,
      title: '',
      slug: '',
      frequency: 'Annual Event',
      date: new Date().toISOString().split('T')[0],
      time: '9:00 AM',
      venue: '',
      description: '',
      coverImageUrl: '',
    });
    setActiveTab('details');
    setModalOpen(true);
  };

  const handleOpenEditModal = (event: any, tab: 'details' | 'gallery' = 'details') => {
    setEditingEvent(event);
    const dateStr = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
    form.reset({
      id: event.id,
      title: event.title,
      slug: event.slug,
      frequency: event.frequency,
      date: dateStr,
      time: event.time || '',
      venue: event.venue,
      description: event.description,
      coverImageUrl: event.coverImageUrl,
    });
    setActiveTab(tab);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
    setGalleryProgress(null);
  };

  // Cover image file handler
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB', 'error');
      return;
    }

    setUploadingCover(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const url = await uploadToCloudinary(base64, 'ules_events');
          form.setValue('coverImageUrl', url, { shouldValidate: true });
          showToast('Cover image uploaded successfully');
        } catch (err: any) {
          showToast(err.message || 'Upload failed', 'error');
        } finally {
          setUploadingCover(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadingCover(false);
      showToast('Failed to read file', 'error');
    }
  };

  // Gallery multi-image file handler
  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingEvent) return;

    setUploadingGallery(true);
    const total = files.length;
    setGalleryProgress({ current: 0, total });

    const uploadedUrls: string[] = [];

    for (let i = 0; i < total; i++) {
      const file = files[i];
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const url = await uploadToCloudinary(base64, 'ules_gallery');
        uploadedUrls.push(url);
        setGalleryProgress({ current: i + 1, total });
      } catch (err) {
        console.error(`Error uploading image ${file.name}:`, err);
      }
    }

    if (uploadedUrls.length > 0) {
      try {
        await addGalleryImages(editingEvent.id, uploadedUrls);
        showToast(`Uploaded ${uploadedUrls.length} image(s) to gallery`);
        // Refresh event data in state
        const updatedList = await getEvents();
        setEvents(updatedList);
        const refreshedCurrent = updatedList.find((ev) => ev.id === editingEvent.id);
        if (refreshedCurrent) setEditingEvent(refreshedCurrent);
      } catch (err: any) {
        showToast('Failed to attach images to event', 'error');
      }
    }

    setUploadingGallery(false);
    setGalleryProgress(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleDeleteGalleryImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;

    try {
      await deleteGalleryImage(imageId);
      showToast('Photo removed from gallery');
      const updatedList = await getEvents();
      setEvents(updatedList);
      if (editingEvent) {
        const refreshedCurrent = updatedList.find((ev) => ev.id === editingEvent.id);
        if (refreshedCurrent) setEditingEvent(refreshedCurrent);
      }
    } catch (err: any) {
      showToast('Failed to delete gallery image', 'error');
    }
  };

  const onSubmit = async (values: FormValues) => {
    startTransition(async () => {
      try {
        const result = await createOrUpdateEvent({
          ...values,
          date: new Date(values.date),
        });
        showToast(values.id ? 'Event updated successfully' : 'Event created successfully');
        const updatedList = await getEvents();
        setEvents(updatedList);

        if (!values.id && result) {
          // Switch to gallery tab for newly created event
          setEditingEvent(result);
          form.setValue('id', result.id);
          setActiveTab('gallery');
        } else {
          handleCloseModal();
        }
      } catch (err: any) {
        showToast(err.message || 'Operation failed', 'error');
      }
    });
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also remove all its gallery photos.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteEvent(id);
        showToast(`"${title}" deleted successfully`);
        await loadEvents();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete event', 'error');
      }
    });
  };

  // Filtered list
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate >= now;
      const hasGallery = (event.galleryImages?.length || event._count?.galleryImages || 0) > 0;

      // Status Filter
      if (statusFilter === 'upcoming' && !isUpcoming) return false;
      if (statusFilter === 'past' && isUpcoming) return false;
      if (statusFilter === 'gallery' && !hasGallery) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(query);
        const matchesVenue = event.venue?.toLowerCase().includes(query);
        const matchesSlug = event.slug?.toLowerCase().includes(query);
        return matchesTitle || matchesVenue || matchesSlug;
      }

      return true;
    });
  }, [events, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const now = new Date();
  const upcomingCount = events.filter((e) => new Date(e.date) >= now).length;
  const pastCount = events.filter((e) => new Date(e.date) < now).length;
  const galleryCount = events.filter((e) => (e.galleryImages?.length || e._count?.galleryImages || 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all ${
            toastMessage.type === 'success' ? 'bg-[#106333] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">Events & Gallery Management</h1>
          <p className="mt-1 text-sm text-gray-400">
            Create, manage and publish ULES events and their associated gallery photo collections.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#C85B15] text-white hover:bg-[#a6480e] shadow-sm flex items-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </Button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#1E1C38] p-4">
          <p className="text-xs font-medium text-gray-400">Total Events</p>
          <p className="mt-2 text-2xl font-bold text-white">{events.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1E1C38] p-4">
          <p className="text-xs font-medium text-emerald-400">Upcoming Events</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{upcomingCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1E1C38] p-4">
          <p className="text-xs font-medium text-blue-400">Past Events</p>
          <p className="mt-2 text-2xl font-bold text-blue-300">{pastCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#1E1C38] p-4">
          <p className="text-xs font-medium text-[#C85B15]">Active Galleries</p>
          <p className="mt-2 text-2xl font-bold text-[#C85B15]">{galleryCount}</p>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by title, venue, or slug..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-[#1E1C38] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C85B15]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto rounded-lg border border-white/10 bg-[#1E1C38] p-1 text-xs">
          <button
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-[#C85B15] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => {
              setStatusFilter('upcoming');
              setCurrentPage(1);
            }}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'upcoming' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => {
              setStatusFilter('past');
              setCurrentPage(1);
            }}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'past' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Past ({pastCount})
          </button>
          <button
            onClick={() => {
              setStatusFilter('gallery');
              setCurrentPage(1);
            }}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'gallery' ? 'bg-[#C85B15] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Has Gallery ({galleryCount})
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1E1C38]">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-16 text-gray-400">Cover</TableHead>
              <TableHead className="text-gray-400">Event Details</TableHead>
              <TableHead className="text-gray-400">Date & Time</TableHead>
              <TableHead className="text-gray-400">Venue</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Gallery</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                  No events found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event) => {
                const eventDate = new Date(event.date);
                const isUpcoming = eventDate >= now;
                const photoCount = event.galleryImages?.length || event._count?.galleryImages || 0;

                return (
                  <TableRow key={event.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="relative h-12 w-16 overflow-hidden rounded-md border border-white/10 bg-black/40">
                        {event.coverImageUrl ? (
                          <img
                            src={event.coverImageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-500">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{event.title}</span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-gray-300">
                            {event.frequency}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">/{event.slug}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                          <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="truncate max-w-[150px]">{event.venue}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {isUpcoming ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-500/15 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-500/30">
                          Past Event
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {photoCount > 0 ? (
                        <button
                          onClick={() => handleOpenEditModal(event, 'gallery')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#C85B15]/20 px-2.5 py-1 text-xs font-medium text-[#C85B15] border border-[#C85B15]/40 hover:bg-[#C85B15]/30 transition-colors"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>{photoCount} photos</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenEditModal(event, 'gallery')}
                          className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add photos</span>
                        </button>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/activities/events/${event.slug}`}
                          target="_blank"
                          className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(event, 'details')}
                          className="rounded p-1.5 text-blue-400 hover:bg-blue-500/15 transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="rounded p-1.5 text-red-400 hover:bg-red-500/15 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-gray-400">
            <span>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} events
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0 border-white/10 bg-transparent text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-white font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0 border-white/10 bg-transparent text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-[#170A51] shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingEvent ? `Edit: ${editingEvent.title}` : 'Create New Event'}
                </h2>
                <p className="text-xs text-gray-300">
                  {editingEvent ? 'Manage event details and gallery photos' : 'Fill in the information to publish a new event'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-black/20 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'border-[#C85B15] text-[#C85B15]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Event Details
              </button>
              <button
                onClick={() => {
                  if (!editingEvent) {
                    showToast('Save event details first before managing the gallery', 'error');
                    return;
                  }
                  setActiveTab('gallery');
                }}
                className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'gallery'
                    ? 'border-[#C85B15] text-[#C85B15]'
                    : 'border-transparent text-gray-400 hover:text-white'
                } ${!editingEvent ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ImageIcon className="h-4 w-4" />
                Gallery Management
                {editingEvent?.galleryImages?.length ? (
                  <span className="rounded-full bg-[#C85B15]/30 px-2 py-0.5 text-xs text-[#C85B15] font-bold">
                    {editingEvent.galleryImages.length}
                  </span>
                ) : null}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {activeTab === 'details' ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Title & Frequency */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Event Title *
                      </label>
                      <Input
                        {...form.register('title')}
                        placeholder="e.g. ULES Dinner & Awards 2026"
                        className="bg-black/30 border-white/15 text-white focus-visible:ring-[#C85B15]"
                        onChange={(e) => {
                          form.setValue('title', e.target.value);
                          if (!editingEvent) {
                            form.setValue('slug', slugify(e.target.value));
                          }
                        }}
                      />
                      {form.formState.errors.title && (
                        <p className="text-xs text-red-400">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Frequency *
                      </label>
                      <select
                        {...form.register('frequency')}
                        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C85B15]"
                      >
                        {FREQUENCY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#170A51] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      URL Slug
                    </label>
                    <div className="flex items-center rounded-md border border-white/15 bg-black/30 px-3">
                      <span className="text-xs text-gray-500 font-mono">/activities/events/</span>
                      <input
                        {...form.register('slug')}
                        placeholder="dinner-awards-2026"
                        className="w-full bg-transparent py-2 pl-1 text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Date, Time, Venue */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Date *
                      </label>
                      <Input
                        type="date"
                        {...form.register('date')}
                        className="bg-black/30 border-white/15 text-white focus-visible:ring-[#C85B15]"
                      />
                      {form.formState.errors.date && (
                        <p className="text-xs text-red-400">{form.formState.errors.date.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Time
                      </label>
                      <Input
                        {...form.register('time')}
                        placeholder="e.g. 10:00 AM"
                        className="bg-black/30 border-white/15 text-white focus-visible:ring-[#C85B15]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Venue *
                      </label>
                      <Input
                        {...form.register('venue')}
                        placeholder="e.g. Jelili Omotola Hall, UNILAG"
                        className="bg-black/30 border-white/15 text-white focus-visible:ring-[#C85B15]"
                      />
                      {form.formState.errors.venue && (
                        <p className="text-xs text-red-400">{form.formState.errors.venue.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Cover Image Upload (Cloudinary Dropzone) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Cover Image (Cloudinary Dropzone) *
                    </label>
                    <input
                      type="file"
                      ref={coverInputRef}
                      onChange={handleCoverFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {form.watch('coverImageUrl') ? (
                      <div className="relative aspect-16/7 w-full overflow-hidden rounded-xl border border-white/15 bg-black/40">
                        <img
                          src={form.watch('coverImageUrl')}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploadingCover}
                          >
                            Replace Image
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => form.setValue('coverImageUrl', '', { shouldValidate: true })}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-black/20 p-8 text-center transition-colors hover:border-[#C85B15] hover:bg-black/30"
                      >
                        {uploadingCover ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-[#C85B15]" />
                            <p className="text-sm font-medium text-white">Uploading to Cloudinary...</p>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm font-medium text-white">
                              Click or drop image to upload to Cloudinary
                            </p>
                            <p className="mt-1 text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
                          </>
                        )}
                      </div>
                    )}
                    {form.formState.errors.coverImageUrl && (
                      <p className="text-xs text-red-400">{form.formState.errors.coverImageUrl.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Description & Details *
                    </label>
                    <Textarea
                      {...form.register('description')}
                      rows={5}
                      placeholder="Detailed event information, theme, highlights, agenda, dress code..."
                      className="bg-black/30 border-white/15 text-white focus-visible:ring-[#C85B15]"
                    />
                    {form.formState.errors.description && (
                      <p className="text-xs text-red-400">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || uploadingCover}
                      className="bg-[#C85B15] text-white hover:bg-[#a6480e] font-semibold"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingEvent ? (
                        'Save Event Changes'
                      ) : (
                        'Create & Proceed to Gallery'
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                /* GALLERY MANAGEMENT SECTION */
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Upload Gallery Photos</h3>
                      <p className="text-xs text-gray-400">
                        Upload multiple photos at once. They will immediately link to this event and appear on the public Gallery pages.
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={galleryInputRef}
                      onChange={handleGalleryFilesChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={uploadingGallery}
                      className="bg-[#106333] hover:bg-[#0c4e28] text-white flex items-center gap-2 font-medium shrink-0"
                    >
                      {uploadingGallery ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading {galleryProgress ? `(${galleryProgress.current}/${galleryProgress.total})` : ''}
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          Upload Photos
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Multi-upload dropzone box */}
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-black/20 p-6 text-center transition-colors hover:border-[#106333] hover:bg-black/30"
                  >
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-white">
                      Drop multiple photos here or click to browse
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      You can select multiple images simultaneously for batch upload to Cloudinary.
                    </p>
                  </div>

                  {/* Photos Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                        Attached Photos ({editingEvent?.galleryImages?.length || 0})
                      </h4>
                      {editingEvent && (
                        <Link
                          href={`/activities/gallery/${editingEvent.slug}`}
                          target="_blank"
                          className="text-xs text-[#C85B15] hover:underline flex items-center gap-1"
                        >
                          View public gallery album
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>

                    {!editingEvent?.galleryImages || editingEvent.galleryImages.length === 0 ? (
                      <div className="rounded-xl border border-white/10 bg-black/20 p-8 text-center text-gray-400">
                        <ImageIcon className="mx-auto h-8 w-8 opacity-40" />
                        <p className="mt-2 text-sm">No photos attached to this event yet.</p>
                        <p className="text-xs text-gray-500">
                          Use the upload button above to add photos at any time.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {editingEvent.galleryImages.map((img: any) => (
                          <div
                            key={img.id}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-white/15 bg-black/40"
                          >
                            <img
                              src={img.imageUrl}
                              alt="Gallery photo"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(img.id)}
                                className="rounded-full bg-red-600/90 p-2 text-white hover:bg-red-700 transition-colors shadow-lg"
                                title="Delete Photo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Close / Done button */}
                  <div className="flex items-center justify-end pt-3 border-t border-white/10">
                    <Button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-[#C85B15] text-white hover:bg-[#a6480e]"
                    >
                      Done Managing Gallery
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
