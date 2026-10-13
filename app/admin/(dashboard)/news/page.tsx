'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  getAllAdminNews,
  createOrUpdateNews,
  toggleNewsPublished,
  deleteNews,
  type NewsItemData,
} from '@/app/actions/news';
import { uploadToCloudinary } from '@/app/actions/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Trash2,
  UploadCloud,
  Loader2,
  Edit,
  ExternalLink,
  Newspaper,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const newsFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Display date is required (e.g., June 12, 2026)'),
  description: z.string().min(10, 'Summary/Description must be at least 10 characters'),
  body: z.string().min(20, 'News body must be at least 20 characters'),
  imageUrl: z.string().min(1, 'Cover image is required. Please upload an image.'),
  imageAlt: z.string().optional(),
  isPublished: z.boolean(),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

const INITIAL_FORM_VALUES: NewsFormValues = {
  id: undefined,
  title: '',
  slug: '',
  category: 'Digest',
  date: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
  description: '',
  body: '',
  imageUrl: '',
  imageAlt: '',
  isPublished: true,
};

export default function NewsAdminPage() {
  const [newsList, setNewsList] = useState<NewsItemData[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  const loadNews = async () => {
    const data = await getAllAdminNews();
    setNewsList(data);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    setFormFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (values: NewsFormValues) => {
    setFormFeedback(null);
    startTransition(async () => {
      const result = await createOrUpdateNews({
        id: editingId || undefined,
        slug: values.slug?.trim() || undefined,
        title: values.title,
        category: values.category || 'Digest',
        date: values.date,
        description: values.description,
        body: values.body,
        imageUrl: values.imageUrl,
        imageAlt: values.imageAlt || values.title,
        isPublished: values.isPublished,
      });

      if (result.success) {
        setFormFeedback({
          type: 'success',
          message: editingId ? 'News article updated successfully!' : 'New article created successfully!',
        });
        handleCancelEdit();
        await loadNews();
      } else {
        setFormFeedback({
          type: 'error',
          message: result.error || 'Failed to save news article.',
        });
      }
    });
  };

  const handleEdit = (item: NewsItemData) => {
    setEditingId(item.id);
    setFormFeedback(null);
    form.reset({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category || 'Digest',
      date: item.date,
      description: item.description,
      body: item.body,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt || '',
      isPublished: item.isPublished,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      startTransition(async () => {
        await deleteNews(id);
        if (editingId === id) handleCancelEdit();
        await loadNews();
      });
    }
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleNewsPublished(id, !currentStatus);
      await loadNews();
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormFeedback(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const secureUrl = await uploadToCloudinary(base64, 'ules_news');
          form.setValue('imageUrl', secureUrl, { shouldValidate: true });
        } catch (err: any) {
          console.error(err);
          setFormFeedback({
            type: 'error',
            message: 'Failed to upload image: ' + (err.message || 'Unknown error'),
          });
        } finally {
          setUploadingImage(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        setFormFeedback({ type: 'error', message: 'Failed to read image file.' });
        setUploadingImage(false);
      };
    } catch (err) {
      console.error(err);
      setFormFeedback({ type: 'error', message: 'An unexpected error occurred during upload.' });
      setUploadingImage(false);
    }
  };

  const imageUrl = form.watch('imageUrl');

  const filteredNews = newsList.filter((item) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto max-w-7xl px-2 py-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#22203E]">News & Digest CMS</h1>
          <p className="text-sm text-gray-500">
            Publish, edit, and manage ULES Bi-weekly Digest issues and faculty announcements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            Total Issues: {newsList.length}
          </span>
          <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Live: {newsList.filter((n) => n.isPublished).length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left Column: Form Section */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="mb-6 flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-bold text-[#22203E]">
              {editingId ? 'Edit News Article' : 'Create New Article'}
            </h2>
            {editingId && (
              <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded">
                Editing Mode
              </span>
            )}
          </div>

          {formFeedback && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
                formFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {formFeedback.type === 'success' ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-red-600" />
              )}
              <span>{formFeedback.message}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Article Title *</label>
              <Input placeholder="e.g. In the Thick of It" {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Category Selector */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Category *</label>
              <Select
                value={form.watch('category')}
                onValueChange={(val) => form.setValue('category', val || 'Digest', { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digest">Bi-weekly Digest</SelectItem>
                  <SelectItem value="Academic">Academic Updates</SelectItem>
                  <SelectItem value="Campus Life">Campus Life & Events</SelectItem>
                  <SelectItem value="Innovation">Innovation & Tech</SelectItem>
                  <SelectItem value="Announcements">Announcements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Slug */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                URL Slug <span className="text-xs font-normal text-gray-400">(optional, auto-generated)</span>
              </label>
              <Input placeholder="e.g. ules-digest-issue-15" {...form.register('slug')} />
            </div>

            {/* Display Date */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Display Date *</label>
              <Input placeholder="e.g. June 15, 2026" {...form.register('date')} />
              {form.formState.errors.date && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.date.message}</p>
              )}
            </div>

            {/* Summary / Description */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Summary *
              </label>
              <Textarea
                placeholder="Short 2-3 sentence overview of this digest issue..."
                className="min-h-[80px] resize-y"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Cover Image Upload (No default button, single change/upload button) */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Cover Image *</label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />

              {imageUrl ? (
                <div className="space-y-2">
                  <div className="relative h-44 w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                    <Image
                      src={imageUrl}
                      alt="Cover preview"
                      fill
                      sizes="350px"
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
                    <UploadCloud className="mr-1.5 size-3.5" /> Change Image
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    uploadingImage
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-[#185A48]/30 bg-[#185A48]/5 hover:border-[#185A48] hover:bg-[#185A48]/10'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Loader2 className="mb-1.5 size-5 animate-spin" />
                      <span className="text-xs">Uploading image to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-[#185A48]">
                      <UploadCloud className="mb-1.5 size-7 opacity-80" />
                      <span className="text-xs font-semibold">Click to upload cover image</span>
                      <span className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, or WebP</span>
                    </div>
                  )}
                </div>
              )}
              {form.formState.errors.imageUrl && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>

            {/* Article Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700">Article Body *</label>
                <span className="text-[11px] text-muted-foreground">Formatted text</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-1.5">
                Tip: Use <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">##</code> for Headings, and <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">--</code> for Attributions (e.g. <span className="italic">-- Damilare Aribisala, PRO</span>).
              </p>
              <Textarea
                placeholder="Type or paste the digest text here.&#10;&#10;## INFO DESK&#10;Preparations for faculty week are underway...&#10;-- Damilare Aribisala, President&#10;&#10;## FROM THE AGS' DESK&#10;Welcome everyone to the new semester!&#10;-- Olamide Lawal, PRO"
                className="min-h-[220px] resize-y font-sans text-sm leading-relaxed"
                {...form.register('body')}
              />
              {form.formState.errors.body && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.body.message}</p>
              )}
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <input
                type="checkbox"
                id="isPublished"
                className="size-4 rounded border-gray-300 text-[#185A48] focus:ring-[#185A48]"
                {...form.register('isPublished')}
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">
                Publish Live immediately
              </label>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending || uploadingImage}
                className="w-full bg-[#185A48] hover:bg-[#124134] text-white"
              >
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {editingId ? 'Update News Article' : 'Publish News Article'}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="mt-2 w-full text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: News Table */}
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2 w-full">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#22203E]">
                Published & Draft News ({filteredNews.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Click live to toggle status, or edit to update.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Filter by title, category, slug..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                  <TableHead className="font-semibold text-xs text-gray-600">Article Title</TableHead>
                  <TableHead className="font-semibold text-xs text-gray-600 w-28">Category</TableHead>
                  <TableHead className="font-semibold text-xs text-gray-600 w-28">Date</TableHead>
                  <TableHead className="font-semibold text-xs text-gray-600 w-20">Status</TableHead>
                  <TableHead className="text-right font-semibold text-xs text-gray-600 w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => {
                  const displayTitle = item.title.length > 36 ? `${item.title.slice(0, 36)}…` : item.title;
                  return (
                    <TableRow key={item.id} className="group hover:bg-slate-50/70">
                      {/* Article Info with Ellipsis */}
                      <TableCell className="max-w-[240px]">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                            <Image
                              src={item.imageUrl || '/news/default.png'}
                              alt={item.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="font-semibold text-[#22203E] text-xs sm:text-sm truncate"
                              title={item.title}
                            >
                              {displayTitle}
                            </p>
                            <p className="text-[11px] text-gray-400 font-mono truncate">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="text-xs whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category || 'Digest'}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                        {item.date}
                      </TableCell>

                      {/* Status Toggle */}
                      <TableCell>
                        <button
                          onClick={() => handleTogglePublish(item.id, item.isPublished)}
                          disabled={isPending}
                          title="Click to toggle publish status"
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors border ${
                            item.isPublished
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {item.isPublished ? 'Live' : 'Draft'}
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/stories/news/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex size-7.5 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            title="View Live Article"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(item.id, item.title)}
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredNews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Newspaper className="mb-2 size-8 text-gray-300" />
                        <p className="text-sm font-medium">No news articles found</p>
                        {filterQuery ? (
                          <p className="text-xs text-gray-400 mt-1">Try a different search filter.</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">Create an article using the form on the left.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
