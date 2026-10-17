'use client';

import { useState, useEffect, useTransition, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createOrUpdateSpotlight,
  toggleSpotlightPublished,
  getSpotlights,
  deleteSpotlight,
} from '@/app/actions/spotlight';
import { uploadToCloudinary } from '@/app/actions/upload';
import { compressImageFile } from '@/lib/image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import {
  Trash2,
  UploadCloud,
  X,
  Loader2,
  Edit,
  Star,
  Plus,
  Search,
  Sparkles,
  Users,
  GraduationCap,
  Eye,
  EyeOff,
} from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['volunteer', 'lecturer']),
  monthYear: z.string().min(1, 'Month/Year is required'),
  name: z.string().min(1, 'Name is required'),
  departmentOrRole: z.string().min(1, 'Department/Role is required'),
  story: z.string().min(10, 'Story is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  isPublished: z.boolean(),
});

type SpotlightType = 'volunteer' | 'lecturer';

const INITIAL_FORM_VALUES = {
  id: undefined,
  type: 'volunteer' as SpotlightType,
  monthYear: '',
  name: '',
  departmentOrRole: '',
  story: '',
  imageUrl: '',
  isPublished: true,
};

export default function SpotlightsAdminPage() {
  const [spotlights, setSpotlights] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'volunteer' | 'lecturer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  useEffect(() => {
    loadSpotlights();
  }, []);

  const loadSpotlights = async () => {
    const data = await getSpotlights();
    setSpotlights(data);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const handleOpenEditModal = (spotlight: any) => {
    setEditingId(spotlight.id);
    form.reset({
      id: spotlight.id,
      type: spotlight.type as SpotlightType,
      monthYear: spotlight.monthYear,
      name: spotlight.name,
      departmentOrRole: spotlight.departmentOrRole,
      story: spotlight.story,
      imageUrl: spotlight.imageUrl,
      isPublished: spotlight.isPublished,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const payload = editingId ? { ...values, id: editingId } : { ...values, id: undefined };
      await createOrUpdateSpotlight(payload);
      handleCloseModal();
      await loadSpotlights();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete the spotlight for "${name}"?`)) {
      startTransition(async () => {
        await deleteSpotlight(id);
        await loadSpotlights();
      });
    }
  };

  const handleTogglePublish = (id: string, isPublished: boolean) => {
    startTransition(async () => {
      await toggleSpotlightPublished(id, !isPublished);
      await loadSpotlights();
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const base64 = await compressImageFile(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.82 });
      const secureUrl = await uploadToCloudinary(base64);
      form.setValue('imageUrl', secureUrl, { shouldValidate: true });
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const imageUrl = form.watch('imageUrl');

  // Filtered spotlights
  const filteredSpotlights = useMemo(() => {
    return spotlights.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesRole = s.departmentOrRole.toLowerCase().includes(q);
        const matchesMonth = s.monthYear.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesMonth) return false;
      }

      if (typeFilter !== 'all' && s.type !== typeFilter) {
        return false;
      }

      if (statusFilter === 'live' && !s.isPublished) return false;
      if (statusFilter === 'draft' && s.isPublished) return false;

      return true;
    });
  }, [spotlights, searchQuery, typeFilter, statusFilter]);

  const volunteerCount = spotlights.filter((s) => s.type === 'volunteer').length;
  const lecturerCount = spotlights.filter((s) => s.type === 'lecturer').length;
  const liveCount = spotlights.filter((s) => s.isPublished).length;

  // Identify which volunteer and lecturer are currently featured live on /spotlight
  // (the newest published record for each type)
  const activeVolunteerId = useMemo(
    () => spotlights.find((s) => s.type === 'volunteer' && s.isPublished)?.id,
    [spotlights]
  );
  const activeLecturerId = useMemo(
    () => spotlights.find((s) => s.type === 'lecturer' && s.isPublished)?.id,
    [spotlights]
  );

  return (
    <div className="space-y-6 font-['Neue_Machina']">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
            Spotlight Features
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Highlight and celebrate outstanding engineering students, volunteers, and lecturers.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto bg-[#170A51] hover:bg-[#22203E] text-white shadow-xs flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Spotlight</span>
        </Button>
      </div>

      {/* Metric Cards Row - Compact Height */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs flex items-center gap-3 hover:border-[#170A51]/30 transition-all">
          <div className="size-9 rounded-lg bg-[#170A51]/10 flex items-center justify-center text-[#170A51] shrink-0">
            <Sparkles className="size-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
              Total Spotlights
            </span>
            <span className="text-xl font-['Anton'] text-[#170A51] leading-none mt-0.5 block">
              {spotlights.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs flex items-center gap-3 hover:border-[#C85B15]/30 transition-all">
          <div className="size-9 rounded-lg bg-[#C85B15]/10 flex items-center justify-center text-[#C85B15] shrink-0">
            <Users className="size-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
              Volunteers
            </span>
            <span className="text-xl font-['Anton'] text-[#C85B15] leading-none mt-0.5 block">
              {volunteerCount}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs flex items-center gap-3 hover:border-[#106333]/30 transition-all">
          <div className="size-9 rounded-lg bg-[#106333]/10 flex items-center justify-center text-[#106333] shrink-0">
            <GraduationCap className="size-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
              Lecturers
            </span>
            <span className="text-xl font-['Anton'] text-[#106333] leading-none mt-0.5 block">
              {lecturerCount}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs flex items-center gap-3 hover:border-emerald-300 transition-all">
          <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Eye className="size-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block truncate">
              Live Published
            </span>
            <span className="text-xl font-['Anton'] text-emerald-700 leading-none mt-0.5 block">
              {liveCount}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, department, or month..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-2xs w-full"
          />
        </div>

        <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1 text-xs shadow-2xs w-max">
            <button
              onClick={() => setTypeFilter('all')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-[#170A51] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('volunteer')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === 'volunteer'
                  ? 'bg-[#C85B15] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Volunteers ({volunteerCount})
            </button>
            <button
              onClick={() => setTypeFilter('lecturer')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === 'lecturer'
                  ? 'bg-[#106333] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Lecturers ({lecturerCount})
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Spotlights Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[860px] w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                <TableHead className="w-16 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Photo</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Featured Individual</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Type</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Edition</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Story Excerpt</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap text-center min-w-[90px]">Status</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap text-right pr-4 min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {filteredSpotlights.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                    <Star className="size-8 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">No spotlight features found</p>
                    <p className="text-xs text-gray-500">
                      {searchQuery
                        ? 'Try clearing the search query or filter.'
                        : 'Click "Create New Spotlight" above to feature an outstanding student or lecturer.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSpotlights.map((s) => (
                <TableRow key={s.id} className="hover:bg-gray-50/80 border-b border-gray-100 transition-colors">
                  {/* Photo */}
                  <TableCell className="py-3">
                    <div className="relative size-11 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-slate-100">
                      {s.imageUrl ? (
                        <Image
                          src={s.imageUrl}
                          alt={s.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-gray-400">
                          <Users className="size-5" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Name & Role */}
                  <TableCell className="py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm truncate">{s.name}</p>
                        {(s.id === activeVolunteerId || s.id === activeLecturerId) && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#170A51] text-amber-300 shrink-0 shadow-2xs"
                            title="Currently featured on the public /spotlight page"
                          >
                            ★ Live on /spotlight
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{s.departmentOrRole}</p>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
                        s.type === 'volunteer'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {s.type}
                    </span>
                  </TableCell>

                  {/* Edition / MonthYear */}
                  <TableCell className="py-3 text-xs text-gray-600 font-medium whitespace-nowrap">
                    {s.monthYear}
                  </TableCell>

                  {/* Story Excerpt */}
                  <TableCell className="py-3 max-w-xs">
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {s.story}
                    </p>
                  </TableCell>

                  {/* Status Toggle */}
                  <TableCell className="py-3 text-center">
                    <button
                      onClick={() => handleTogglePublish(s.id, s.isPublished)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                        s.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {s.isPublished ? (
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

                  {/* Actions */}
                  <TableCell className="py-3 text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(s)}
                        className="size-8 p-0 text-gray-500 hover:text-[#170A51] hover:bg-[#170A51]/10"
                        title="Edit Spotlight"
                      >
                        <Edit className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(s.id, s.name)}
                        className="size-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Spotlight"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-6 py-4">
              <div>
                <h2 className="text-xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
                  {editingId ? 'Edit Spotlight' : 'Create New Spotlight'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingId
                    ? 'Update the profile and story of this featured individual'
                    : 'Fill in the information to publish a new volunteer or lecturer spotlight'}
                </p>
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
              {/* Type and Month/Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Spotlight Type *
                  </label>
                  <Select
                    onValueChange={(val) => form.setValue('type', val as SpotlightType, { shouldValidate: true })}
                    value={form.watch('type')}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="volunteer">Volunteer of the Month</SelectItem>
                      <SelectItem value="lecturer">Lecturer Feature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Month / Year *
                  </label>
                  <Input
                    placeholder="e.g. October 2026"
                    {...form.register('monthYear')}
                    className="bg-white"
                  />
                  {form.formState.errors.monthYear && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.monthYear.message}</p>
                  )}
                </div>
              </div>

              {/* Name & Department/Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Full Name *
                  </label>
                  <Input
                    placeholder="e.g. Engr. Dr. Babatunde"
                    {...form.register('name')}
                    className="bg-white"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Department / Role *
                  </label>
                  <Input
                    placeholder="e.g. Mechanical Engineering"
                    {...form.register('departmentOrRole')}
                    className="bg-white"
                  />
                  {form.formState.errors.departmentOrRole && (
                    <p className="text-xs text-red-500 mt-1">{form.formState.errors.departmentOrRole.message}</p>
                  )}
                </div>
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Profile Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />

                {imageUrl ? (
                  <div className="space-y-2">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs">
                      <Image
                        src={imageUrl}
                        alt="Uploaded preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-medium text-gray-700 bg-gray-50 border-gray-300 hover:bg-gray-100"
                      onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-4 h-4 mr-1.5" /> Change Image
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                      uploadingImage
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-[#185A48]/30 hover:border-[#185A48] bg-[#185A48]/5 hover:bg-[#185A48]/10'
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#185A48]" />
                        <span className="text-xs font-medium text-gray-700">Uploading image...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-[#185A48]">
                        <UploadCloud className="w-8 h-8 mb-2 opacity-80" />
                        <span className="text-xs font-semibold">Click to upload photo</span>
                        <span className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, or WebP up to 5MB</span>
                      </div>
                    )}
                  </div>
                )}
                {form.formState.errors.imageUrl && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>

              {/* Story / Description */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Story / Achievements *
                </label>
                <Textarea
                  placeholder="Share their remarkable journey, contributions to ULES, or engineering achievements..."
                  className="min-h-[140px] resize-y text-sm bg-white"
                  {...form.register('story')}
                />
                {form.formState.errors.story && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.story.message}</p>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <input
                  type="checkbox"
                  id="spotlightIsPublished"
                  className="size-4 rounded border-gray-300 text-[#170A51] focus:ring-[#170A51]"
                  {...form.register('isPublished')}
                />
                <label htmlFor="spotlightIsPublished" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Publish live immediately on public website
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
                  className="bg-[#170A51] hover:bg-[#22203E] text-white text-xs font-semibold"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editingId ? 'Update Spotlight' : 'Create Spotlight'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
